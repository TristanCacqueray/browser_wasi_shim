(() => {
  // src/wasi_defs.js
  var CLOCKID_REALTIME = 0;
  var ERRNO_BADF = 8;
  var RIGHTS_FD_DATASYNC = 1 << 0;
  var RIGHTS_FD_READ = 1 << 1;
  var RIGHTS_FD_SEEK = 1 << 2;
  var RIGHTS_FD_FDSTAT_SET_FLAGS = 1 << 3;
  var RIGHTS_FD_SYNC = 1 << 4;
  var RIGHTS_FD_TELL = 1 << 5;
  var RIGHTS_FD_WRITE = 1 << 6;
  var RIGHTS_FD_ADVISE = 1 << 7;
  var RIGHTS_FD_ALLOCATE = 1 << 8;
  var RIGHTS_PATH_CREATE_DIRECTORY = 1 << 9;
  var RIGHTS_PATH_CREATE_FILE = 1 << 10;
  var RIGHTS_PATH_LINK_SOURCE = 1 << 11;
  var RIGHTS_PATH_LINK_TARGET = 1 << 12;
  var RIGHTS_PATH_OPEN = 1 << 13;
  var RIGHTS_FD_READDIR = 1 << 14;
  var RIGHTS_PATH_READLINK = 1 << 15;
  var RIGHTS_PATH_RENAME_SOURCE = 1 << 16;
  var RIGHTS_PATH_RENAME_TARGET = 1 << 17;
  var RIGHTS_PATH_FILESTAT_GET = 1 << 18;
  var RIGHTS_PATH_FILESTAT_SET_SIZE = 1 << 19;
  var RIGHTS_PATH_FILESTAT_SET_TIMES = 1 << 20;
  var RIGHTS_FD_FILESTAT_GET = 1 << 21;
  var RIGHTS_FD_FILESTAT_SET_SIZE = 1 << 22;
  var RIGHTS_FD_FILESTAT_SET_TIMES = 1 << 23;
  var RIGHTS_PATH_SYMLINK = 1 << 24;
  var RIGHTS_PATH_REMOVE_DIRECTORY = 1 << 25;
  var RIGHTS_PATH_UNLINK_FILE = 1 << 26;
  var RIGHTS_POLL_FD_READWRITE = 1 << 27;
  var RIGHTS_SOCK_SHUTDOWN = 1 << 28;
  var Iovec = class {
    static read_bytes(view, ptr) {
      let iovec = new Iovec();
      iovec.buf = view.getUint32(ptr, true);
      iovec.buf_len = view.getUint32(ptr + 4, true);
      return iovec;
    }
    static read_bytes_array(view, ptr, len) {
      let iovecs = [];
      for (let i = 0; i < len; i++) {
        iovecs.push(Iovec.read_bytes(view, ptr + 8 * i));
      }
      return iovecs;
    }
  };
  var Ciovec = class {
    static read_bytes(view, ptr) {
      let iovec = new Ciovec();
      iovec.buf = view.getUint32(ptr, true);
      iovec.buf_len = view.getUint32(ptr + 4, true);
      return iovec;
    }
    static read_bytes_array(view, ptr, len) {
      let iovecs = [];
      for (let i = 0; i < len; i++) {
        iovecs.push(Ciovec.read_bytes(view, ptr + 8 * i));
      }
      return iovecs;
    }
  };
  var FILETYPE_CHARACTER_DEVICE = 2;
  var FDFLAGS_APPEND = 1 << 0;
  var FDFLAGS_DSYNC = 1 << 1;
  var FDFLAGS_NONBLOCK = 1 << 2;
  var FDFLAGS_RSYNC = 1 << 3;
  var FDFLAGS_SYNC = 1 << 4;
  var Fdstat = class {
    fs_rights_base = 0n;
    fs_rights_inherited = 0n;
    constructor(filetype, flags) {
      this.fs_filetype = filetype;
      this.fs_flags = flags;
    }
    write_bytes(view, ptr) {
      view.setUint8(ptr, this.fs_filetype);
      view.setUint16(ptr + 2, this.fs_flags, true);
      view.setBigUint64(ptr + 8, this.fs_rights_base, true);
      view.setBigUint64(ptr + 16, this.fs_rights_inherited, true);
    }
  };
  var FSTFLAGS_ATIM = 1 << 0;
  var FSTFLAGS_ATIM_NOW = 1 << 1;
  var FSTFLAGS_MTIM = 1 << 2;
  var FSTFLAGS_MTIM_NOW = 1 << 3;
  var OFLAGS_CREAT = 1 << 0;
  var OFLAGS_DIRECTORY = 1 << 1;
  var OFLAGS_EXCL = 1 << 2;
  var OFLAGS_TRUNC = 1 << 3;
  var EVENTTYPE_CLOCK = 0;
  var EVENTTYPE_FD_READ = 1;
  var EVENTTYPE_FD_WRITE = 2;
  var EVENTRWFLAGS_FD_READWRITE_HANGUP = 1 << 0;
  var SUBCLOCKFLAGS_SUBSCRIPTION_CLOCK_ABSTIME = 1 << 0;
  var RIFLAGS_RECV_PEEK = 1 << 0;
  var RIFLAGS_RECV_WAITALL = 1 << 1;
  var ROFLAGS_RECV_DATA_TRUNCATED = 1 << 0;
  var SDFLAGS_RD = 1 << 0;
  var SDFLAGS_WR = 1 << 1;
  var EventType = class {
    constructor(variant) {
      this.variant = variant;
    }
    static from_u8(data) {
      switch (data) {
        case EVENTTYPE_CLOCK:
          return new EventType("clock");
        case EVENTTYPE_FD_READ:
          return new EventType("fd_read");
        case EVENTTYPE_FD_WRITE:
          return new EventType("fd_write");
        default:
          throw "Invalid event type " + String(data);
      }
    }
    to_u8() {
      switch (this.variant) {
        case "clock":
          return EVENTTYPE_CLOCK;
        case "fd_read":
          return EVENTTYPE_FD_READ;
        case "fd_write":
          return EVENTTYPE_FD_WRITE;
        default:
          throw "unreachable";
      }
    }
  };
  var EventRwFlags = class {
    static from_u16(data) {
      let self2 = new EventRwFlags();
      if ((data & EVENTRWFLAGS_FD_READWRITE_HANGUP) == EVENTRWFLAGS_FD_READWRITE_HANGUP) {
        self2.hangup = true;
      } else {
        self2.hangup = false;
      }
      return self2;
    }
    to_u16() {
      let res = 0;
      if (self.hangup) {
        res = res | EVENTRWFLAGS_FD_READWRITE_HANGUP;
      }
      return res;
    }
  };
  var EventFdReadWrite = class {
    constructor(nbytes, flags) {
      this.nbytes = nbytes;
      this.flags = flags;
    }
    write_bytes(view, ptr) {
      view.setBigUint64(ptr, this.nbytes, true);
      view.setUint16(ptr + 8, this.flags.to_u16(), true);
    }
  };
  var Event = class {
    write_bytes(view, ptr) {
      view.setBigUint64(ptr, this.userdata, true);
      view.setUint32(ptr + 8, this.error, true);
      view.setUint8(ptr + 12, this.type.to_u8());
      if (this.fd_readwrite) {
        this.fd_readwrite.write_bytes(view, ptr + 16);
      }
    }
    static write_bytes_array(view, ptr, events) {
      for (let i = 0; i < events.length; i++) {
        events[i].write_bytes(view, ptr + 32 * i);
      }
    }
  };
  var SubscriptionFdReadWrite = class {
    static read_bytes(view, ptr) {
      let self2 = new SubscriptionFdReadWrite();
      self2.fd = view.getUint32(ptr, true);
      return self2;
    }
  };
  var SubscriptionU = class {
    static read_bytes(view, ptr) {
      let self2 = new SubscriptionU();
      self2.tag = EventType.from_u8(view.getUint8(ptr));
      switch (self2.tag.variant) {
        case "clock":
          break;
        case "fd_read":
        case "fd_write":
          self2.data = SubscriptionFdReadWrite.read_bytes(view, ptr + 4);
          break;
        default:
          throw "unreachable";
      }
      return self2;
    }
  };
  var Subscription = class {
    static read_bytes(view, ptr) {
      let subscription = new Subscription();
      subscription.userdata = view.getBigUint64(ptr, true);
      subscription.u = SubscriptionU.read_bytes(view, ptr + 8);
      return subscription;
    }
    static read_bytes_array(view, ptr, len) {
      let subscriptions = [];
      for (let i = 0; i < len; i++) {
        subscriptions.push(Subscription.read_bytes(view, ptr + 12 * i));
      }
      return subscriptions;
    }
  };

  // src/fd.js
  var Fd = class {
    fd_advise(offset, len, advice) {
      return -1;
    }
    fd_allocate(offset, len) {
      return -1;
    }
    fd_close() {
      return -1;
    }
    fd_datasync() {
      return -1;
    }
    fd_fdstat_get() {
      return { ret: -1, fdstat: null };
    }
    fd_fdstat_set_flags(flags) {
      return -1;
    }
    fd_fdstat_set_rights(fs_rights_base, fs_rights_inheriting) {
      return -1;
    }
    fd_filestat_get() {
      return { ret: -1, filestat: null };
    }
    fd_filestat_set_size(size) {
      return -1;
    }
    fd_filestat_set_times(atim, mtim, fst_flags) {
      return -1;
    }
    fd_pread(view8, iovs, offset) {
      return { ret: -1, nread: 0 };
    }
    fd_prestat_get() {
      return { ret: -1, prestat: null };
    }
    fd_prestat_dir_name(path_ptr, path_len) {
      return { ret: -1, prestat_dir_name: null };
    }
    fd_pwrite(view8, iovs, offset) {
      return { ret: -1, nwritten: 0 };
    }
    fd_read(view8, iovs) {
      return { ret: -1, nread: 0 };
    }
    fd_readdir_single(cookie) {
      return { ret: -1, dirent: null };
    }
    fd_seek(offset, whence) {
      return { ret: -1, offset: 0 };
    }
    fd_sync() {
      return -1;
    }
    fd_tell() {
      return { ret: -1, offset: 0 };
    }
    fd_write(view8, iovs) {
      return { ret: -1, nwritten: 0 };
    }
    path_create_directory(path) {
      return -1;
    }
    path_filestat_get(flags, path) {
      return { ret: -1, filestat: null };
    }
    path_filestat_set_times(flags, path, atim, mtim, fst_flags) {
      return -1;
    }
    path_link(old_fd, old_flags, old_path, new_path) {
      return -1;
    }
    path_open(dirflags, path, oflags, fs_rights_base, fs_rights_inheriting, fdflags) {
      return { ret: -1, fd_obj: null };
    }
    path_readlink(path) {
      return { ret: -1, data: null };
    }
    path_remove_directory(path) {
      return -1;
    }
    path_rename(old_path, new_fd, new_path) {
      return -1;
    }
    path_symlink(old_path, new_path) {
      return -1;
    }
    path_unlink_file(path) {
      return -1;
    }
  };

  // src/wasi.js
  var WASI = class {
    args = [];
    env = [];
    fds = [];
    inst;
    wasiImport;
    start(instance) {
      this.inst = instance;
      instance.exports._start();
    }
    initialize(instance) {
      this.inst = instance;
      instance.exports._initialize();
    }
    constructor(args, env, fds) {
      this.args = args;
      this.env = env;
      this.fds = fds;
      let self2 = this;
      this.wasiImport = {
        args_sizes_get(argc, argv_buf_size) {
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          buffer.setUint32(argc, self2.args.length, true);
          let buf_size = 0;
          for (let arg of self2.args) {
            buf_size += arg.length + 1;
          }
          buffer.setUint32(argv_buf_size, buf_size, true);
          return 0;
        },
        args_get(argv, argv_buf) {
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          let orig_argv_buf = argv_buf;
          for (let i = 0; i < self2.args.length; i++) {
            buffer.setUint32(argv, argv_buf, true);
            argv += 4;
            let arg = new TextEncoder("utf-8").encode(self2.args[i]);
            buffer8.set(arg, argv_buf);
            buffer.setUint8(argv_buf + arg.length, 0);
            argv_buf += arg.length + 1;
          }
          return 0;
        },
        environ_sizes_get(environ_count, environ_size) {
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          buffer.setUint32(environ_count, self2.env.length, true);
          let buf_size = 0;
          for (let environ of self2.env) {
            buf_size += environ.length + 1;
          }
          buffer.setUint32(environ_size, buf_size, true);
          return 0;
        },
        environ_get(environ, environ_buf) {
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          let orig_environ_buf = environ_buf;
          for (let i = 0; i < env.length; i++) {
            buffer.setUint32(environ, environ_buf, true);
            environ += 4;
            let e = new TextEncoder("utf-8").encode(env[i]);
            buffer8.set(e, environ_buf);
            buffer.setUint8(environ_buf + e.length, 0);
            environ_buf += e.length + 1;
          }
          return 0;
        },
        clock_res_get(id, res_ptr) {
          throw "unimplemented";
        },
        clock_time_get(id, precision, time) {
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          if (id === CLOCKID_REALTIME) {
            buffer.setBigUint64(time, BigInt(new Date().getTime()) * 1000000n, true);
          } else {
            buffer.setBigUint64(time, 0n, true);
          }
          return 0;
        },
        fd_advise(fd, offset, len, advice) {
          if (self2.fds[fd] != void 0) {
            return self2.fds[fd].fd_advise(offset, len, advice);
          } else {
            return ERRNO_BADF;
          }
        },
        fd_allocate(fd, offset, len) {
          if (self2.fds[fd] != void 0) {
            return self2.fds[fd].fd_allocate(offset, len);
          } else {
            return ERRNO_BADF;
          }
        },
        fd_close(fd) {
          if (self2.fds[fd] != void 0) {
            let ret = self2.fds[fd].fd_close();
            self2.fds[fd] = void 0;
            return ret;
          } else {
            return ERRNO_BADF;
          }
        },
        fd_datasync(fd) {
          if (self2.fds[fd] != void 0) {
            return self2.fds[fd].fd_datasync();
          } else {
            return ERRNO_BADF;
          }
        },
        fd_fdstat_get(fd, fdstat_ptr) {
          if (self2.fds[fd] != void 0) {
            let { ret, fdstat } = self2.fds[fd].fd_fdstat_get();
            if (fdstat != null) {
              fdstat.write_bytes(new DataView(self2.inst.exports.memory.buffer), fdstat_ptr);
            }
            return ret;
          } else {
            return ERRNO_BADF;
          }
        },
        fd_fdstat_set_flags(fd, flags) {
          if (self2.fds[fd] != void 0) {
            return self2.fds[fd].fd_fdstat_set_flags(flags);
          } else {
            return ERRNO_BADF;
          }
        },
        fd_fdstat_set_rights(fd, fs_rights_base, fs_rights_inheriting) {
          if (self2.fds[fd] != void 0) {
            return self2.fds[fd].fd_fdstat_set_rights(fs_rights_base, fs_rights_inheriting);
          } else {
            return ERRNO_BADF;
          }
        },
        fd_filestat_get(fd, filestat_ptr) {
          if (self2.fds[fd] != void 0) {
            let { ret, filestat } = self2.fds[fd].fd_filestat_get();
            if (filestat != null) {
              filestat.write_bytes(new DataView(self2.inst.exports.memory.buffer), filestat_ptr);
            }
            return ret;
          } else {
            return ERRNO_BADF;
          }
        },
        fd_filestat_set_size(fd, size) {
          if (self2.fds[fd] != void 0) {
            return self2.fds[fd].fd_filestat_set_size(size);
          } else {
            return ERRNO_BADF;
          }
        },
        fd_filestat_set_times(fd, atim, mtim, fst_flags) {
          if (self2.fds[fd] != void 0) {
            return self2.fds[fd].fd_filestat_set_times(atim, mtim, fst_flags);
          } else {
            return ERRNO_BADF;
          }
        },
        fd_pread(fd, iovs_ptr, iovs_len, offset, nread_ptr) {
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          if (self2.fds[fd] != void 0) {
            let iovecs = Iovec.read_bytes_array(buffer, iovs_ptr, iovs_len);
            let { ret, nread } = self2.fds[fd].fd_pread(buffer8, iovecs, offset);
            buffer.setUint32(nread_ptr, nread, true);
            return ret;
          } else {
            return ERRNO_BADF;
          }
        },
        fd_prestat_get(fd, buf_ptr) {
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          if (self2.fds[fd] != void 0) {
            let { ret, prestat } = self2.fds[fd].fd_prestat_get();
            if (prestat != null) {
              prestat.write_bytes(buffer, buf_ptr);
            }
            return ret;
          } else {
            return ERRNO_BADF;
          }
        },
        fd_prestat_dir_name(fd, path_ptr, path_len) {
          if (self2.fds[fd] != void 0) {
            let { ret, prestat_dir_name } = self2.fds[fd].fd_prestat_dir_name();
            if (prestat_dir_name != null) {
              let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
              buffer8.set(prestat_dir_name, path_ptr);
            }
            return ret;
          } else {
            return ERRNO_BADF;
          }
        },
        fd_pwrite(fd, iovs_ptr, iovs_len, offset, nwritten_ptr) {
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          if (self2.fds[fd] != void 0) {
            let iovecs = Ciovec.read_bytes_array(buffer, iovs_ptr, iovs_len);
            let { ret, nwritten } = self2.fds[fd].fd_pwrite(buffer8, iovecs, offset);
            buffer.setUint32(nwritten_ptr, nwritten, true);
            return ret;
          } else {
            return ERRNO_BADF;
          }
        },
        fd_read(fd, iovs_ptr, iovs_len, nread_ptr) {
          console.log("XXX: fd_read", fd);
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          if (self2.fds[fd] != void 0) {
            let iovecs = Iovec.read_bytes_array(buffer, iovs_ptr, iovs_len);
            let { ret, nread } = self2.fds[fd].fd_read(buffer8, iovecs);
            buffer.setUint32(nread_ptr, nread, true);
            return ret;
          } else {
            return ERRNO_BADF;
          }
        },
        fd_readdir(fd, buf, buf_len, cookie, bufused_ptr) {
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          if (self2.fds[fd] != void 0) {
            let bufused = 0;
            while (true) {
              let { ret, dirent } = self2.fds[fd].fd_readdir_single(cookie);
              if (ret != 0) {
                buffer.setUint32(bufused_ptr, bufused, true);
                return ret;
              }
              if (dirent == null) {
                break;
              }
              let offset = dirent.length();
              if (buf_len - bufused < offset) {
                break;
              }
              dirent.write_bytes(buffer, buffer8, buf);
              buf += offset;
              bufused += offset;
              cookie = dirent.d_next;
            }
            buffer.setUint32(bufused_ptr, bufused, true);
            return 0;
          } else {
            return ERRNO_BADF;
          }
        },
        fd_renumber(fd, to) {
          if (self2.fds[fd] != void 0 && self2.fds[to] != void 0) {
            let ret = self2.fds[to].fd_close();
            if (ret != 0) {
              return ret;
            }
            self2.fds[to] = self2.fds[fd];
            self2.fds[fd] = void 0;
            return 0;
          } else {
            return ERRNO_BADF;
          }
        },
        fd_seek(fd, offset, whence, offset_out_ptr) {
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          if (self2.fds[fd] != void 0) {
            let { ret, offset_out } = self2.fds[fd].fd_seek(offset, whence);
            buffer.setUint32(offset_out_ptr, offset_out, true);
            return ret;
          } else {
            return ERRNO_BADF;
          }
        },
        fd_sync(fd) {
          if (self2.fds[fd] != void 0) {
            return self2.fds[fd].fd_sync();
          } else {
            return ERRNO_BADF;
          }
        },
        fd_tell(fd, offset_ptr) {
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          if (self2.fds[fd] != void 0) {
            let { ret, offset } = self2.fds[fd].fd_tell();
            buffer.setUint32(offset_ptr, offset, true);
            return ret;
          } else {
            return ERRNO_BADF;
          }
        },
        fd_write(fd, iovs_ptr, iovs_len, nwritten_ptr) {
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          if (self2.fds[fd] != void 0) {
            let iovecs = Ciovec.read_bytes_array(buffer, iovs_ptr, iovs_len);
            let { ret, nwritten } = self2.fds[fd].fd_write(buffer8, iovecs);
            buffer.setUint32(nwritten_ptr, nwritten, true);
            return ret;
          } else {
            return ERRNO_BADF;
          }
        },
        path_create_directory(fd, path_ptr, path_len) {
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          if (self2.fds[fd] != void 0) {
            let path = new TextDecoder("utf-8").decode(buffer8.slice(path_ptr, path_ptr + path_len));
            return self2.fds[fd].path_create_directory(path);
          }
        },
        path_filestat_get(fd, flags, path_ptr, path_len, filestat_ptr) {
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          if (self2.fds[fd] != void 0) {
            let path = new TextDecoder("utf-8").decode(buffer8.slice(path_ptr, path_ptr + path_len));
            let { ret, filestat } = self2.fds[fd].path_filestat_get(flags, path);
            if (filestat != null) {
              filestat.write_bytes(buffer, filestat_ptr);
            }
            return ret;
          } else {
            return ERRNO_BADF;
          }
        },
        path_filestat_set_times(fd, flags, path_ptr, path_len, atim, mtim, fst_flags) {
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          if (self2.fds[fd] != void 0) {
            let path = new TextDecoder("utf-8").decode(buffer8.slice(path_ptr, path_ptr + path_len));
            return self2.fds[fd].path_filestat_set_times(flags, path, atim, mtim, fst_flags);
          } else {
            return ERRNO_BADF;
          }
        },
        path_link(old_fd, old_flags, old_path_ptr, old_path_len, new_fd, new_path_ptr, new_path_len) {
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          if (self2.fds[old_fd] != void 0 && self2.fds[new_fd] != void 0) {
            let old_path = new TextDecoder("utf-8").decode(buffer8.slice(old_path_ptr, old_path_ptr + old_path_len));
            let new_path = new TextDecoder("utf-8").decode(buffer8.slice(new_path_ptr, new_path_ptr + new_path_len));
            return self2.fds[new_fd].path_link(old_fd, old_flags, old_path, new_path);
          } else {
            return ERRNO_BADF;
          }
        },
        path_open(fd, dirflags, path_ptr, path_len, oflags, fs_rights_base, fs_rights_inheriting, fd_flags, opened_fd_ptr) {
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          if (self2.fds[fd] != void 0) {
            let path = new TextDecoder("utf-8").decode(buffer8.slice(path_ptr, path_ptr + path_len));
            let { ret, fd_obj } = self2.fds[fd].path_open(dirflags, path, oflags, fs_rights_base, fs_rights_inheriting, fd_flags);
            if (ret != 0) {
              return ret;
            }
            self2.fds.push(fd_obj);
            let opened_fd = self2.fds.length - 1;
            buffer.setUint32(opened_fd_ptr, opened_fd, true);
            return 0;
          } else {
            return ERRNO_BADF;
          }
        },
        path_readlink(fd, path_ptr, path_len, buf_ptr, buf_len, nread_ptr) {
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          if (self2.fds[fd] != void 0) {
            let path = new TextDecoder("utf-8").decode(buffer8.slice(path_ptr, path_ptr + path_len));
            let { ret, data } = self2.fds[fd].path_readlink(path);
            if (data != null) {
              if (data.length > buf_len) {
                buffer.setUint32(nread_ptr, 0, true);
                return ERRNO_BADF;
              }
              buffer8.set(data, buf_ptr);
              buffer.setUint32(nread_ptr, data.length, true);
            }
            return ret;
          } else {
            return ERRNO_BADF;
          }
        },
        path_remove_directory(fd, path_ptr, path_len) {
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          if (self2.fds[fd] != void 0) {
            let path = new TextDecoder("utf-8").decode(buffer8.slice(path_ptr, path_ptr + path_len));
            return self2.fds[fd].path_remove_directory(path);
          } else {
            return ERRNO_BADF;
          }
        },
        path_rename(fd, old_path_ptr, old_path_len, new_fd, new_path_ptr, new_path_len) {
          throw "FIXME what is the best abstraction for this?";
        },
        path_symlink(old_path_ptr, old_path_len, fd, new_path_ptr, new_path_len) {
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          if (self2.fds[fd] != void 0) {
            let old_path = new TextDecoder("utf-8").decode(buffer8.slice(old_path_ptr, old_path_ptr + old_path_len));
            let new_path = new TextDecoder("utf-8").decode(buffer8.slice(new_path_ptr, new_path_ptr + new_path_len));
            return self2.fds[fd].path_symlink(old_path, new_path);
          } else {
            return ERRNO_BADF;
          }
        },
        path_unlink_file(fd, path_ptr, path_len) {
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          if (self2.fds[fd] != void 0) {
            let path = new TextDecoder("utf-8").decode(buffer8.slice(path_ptr, path_ptr + path_len));
            return self2.fds[fd].path_unlink_file(path);
          } else {
            return ERRNO_BADF;
          }
        },
        poll_oneoff(in_ptr, out_ptr, nsubscriptions) {
          let buffer = new DataView(self2.inst.exports.memory.buffer);
          let in_ = Subscription.read_bytes_array(
            buffer,
            in_ptr,
            nsubscriptions
          );
          let events = [];
          for (let sub of in_) {
            if (sub.u.tag.variant == "fd_read") {
              let event = new Event();
              event.userdata = sub.userdata;
              event.error = 0;
              event.type = new EventType("fd_read");
              event.fd_readwrite = new EventFdReadWrite(1n, new EventRwFlags());
              events.push(event);
            }
            if (sub.u.tag.variant == "fd_write") {
              let event = new Event();
              event.userdata = sub.userdata;
              event.error = 0;
              event.type = new EventType("fd_write");
              event.fd_readwrite = new EventFdReadWrite(1n, new EventRwFlags());
              events.push(event);
            }
          }
          console.log(events);
          Event.write_bytes_array(buffer, out_ptr, events);
          return events.length;
          throw "async io not supported";
        },
        proc_exit(exit_code) {
          throw "exit with exit code " + exit_code;
        },
        proc_raise(sig) {
          throw "raised signal " + sig;
        },
        sched_yield() {
        },
        random_get(buf, buf_len) {
          let buffer8 = new Uint8Array(self2.inst.exports.memory.buffer);
          for (let i = 0; i < buf_len; i++) {
            buffer8[buf + i] = Math.random() * 256 | 0;
          }
        },
        sock_recv(fd, ri_data, ri_flags) {
          throw "sockets not supported";
        },
        sock_send(fd, si_data, si_flags) {
          throw "sockets not supported";
        },
        sock_shutdown(fd, how) {
          throw "sockets not supported";
        }
      };
    }
  };

  // src/strace.js
  function strace(imports, no_trace) {
    return new Proxy(imports, {
      get(target, prop, receiver) {
        let res = Reflect.get(...arguments);
        if (no_trace.includes(prop)) {
          return res;
        }
        return function(...args) {
          console.log(prop, "(", ...args, ")");
          return Reflect.apply(res, receiver, args);
        };
      }
    });
  }

  // examples/worker.js
  var XTermStdio = class extends Fd {
    constructor(term) {
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
        let buffer = view8.slice(iovec.buf, iovec.buf + iovec.buf_len);
        this.term.write(buffer);
        nwritten += iovec.buf_len;
      }
      return { ret: 0, nwritten };
    }
  };
  onmessage = function(e) {
    console.log("Worker, got sab!");
    const sab = e.data;
    const arr = new Int32Array(sab);
    (async function() {
      const wasm = await WebAssembly.compileStreaming(fetch("worker.wasm"));
      const term = {
        write: (buf) => {
          if (buf.length > 0) {
            const s = new TextDecoder().decode(buf);
            console.log("WASM output", s);
          }
        }
      };
      const fds = [
        new XTermStdio(term),
        new XTermStdio(term),
        new XTermStdio(term)
      ];
      const wasi = new WASI([], ["LC_ALL=en_US.utf-8"], fds);
      const inst = await WebAssembly.instantiate(wasm, {
        "wasi_snapshot_preview1": strace(wasi.wasiImport, ["fd_read"])
      });
      wasi.start(inst);
    })();
  };
})();
