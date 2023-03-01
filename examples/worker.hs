main = do
  putStr "Hello "
  name <- getChar
  putStrLn (name:[])
  main
