// @flow

import { Fd } from "../src/fd.js";
import { File, Directory } from "../src/fs_core.js";
import { Fdstat, FILETYPE_UNKNOWN, FILETYPE_CHARACTER_DEVICE, FDFLAGS_APPEND, FDFLAGS_NONBLOCK, FDFLAGS_DSYNC } from "../src/wasi_defs.js";
import { PreopenDirectory } from "../src/fs_fd.js";
import WASI from "../src/wasi.js";
import { strace } from "../src/strace.js"

class XTermStdio extends Fd {
    /*::term: { write: (Uint8Array) => mixed }*/

    constructor(term/*: { write: (Uint8Array) => mixed }*/) {
        super();
        this.term = term;
    }
    fd_read(view8, iovs) {
        console.log("Reading!", view8, iovs);
        return { ret: 0, nread: 1 };
    }
    fd_fdstat_get() {
        return { ret: 0, fdstat: new Fdstat(FILETYPE_CHARACTER_DEVICE, FDFLAGS_DSYNC) };
    }
    fd_write(view8, iovs) {
        let nwritten = 0;
        for (let iovec of iovs) {
            // console.log(iovec.buf_len, iovec.buf_len, view8.slice(iovec.buf, iovec.buf + iovec.buf_len));
            let buffer = view8.slice(iovec.buf, iovec.buf + iovec.buf_len);
            this.term.write(buffer);
            nwritten += iovec.buf_len;
        }
        return { ret: 0, nwritten };
    }
}

onmessage = function(e) {
  console.log('Worker, got sab!')
  const sab = e.data;
  const arr = new Int32Array(sab);

  (async function () {
    const wasm = await WebAssembly.compileStreaming(fetch("worker.wasm"));
    const term = {
        write: (buf) => {
            if (buf.length > 0) {
              const s = new TextDecoder().decode(buf)
              console.log("WASM output", s)
            }
        }
    }
    const fds = [
        new XTermStdio(term),
        new XTermStdio(term),
        new XTermStdio(term),
    ];
    const wasi = new WASI([], ["LC_ALL=en_US.utf-8"], fds);
    const inst = await WebAssembly.instantiate(wasm, {
        "wasi_snapshot_preview1": strace(wasi.wasiImport, ["fd_read"]),
    });
    wasi.start(inst);
  })()
  /*
  const waitForInput = (prev) =>  {
      console.log('Waiting...')
      Atomics.wait(arr, 0, prev)
      const newChar = arr[0]
      console.log('Atomic: ', newChar)
      waitForInput(newChar)
  }
  waitForInput(0)
  */
}
