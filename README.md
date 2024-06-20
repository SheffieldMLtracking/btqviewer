# btqviewer
An alternative viewer for the bee tracking project

# Install
```pip install git+https://github.com/SheffieldMLtracking/btqviewer.git```

# Usage
Currently one must pass it the root of the whole day's work, e.g.
```btqviewer ~/Documents/Research/rsync_bee/test/beephotos/2023-06-29```

```
usage: btqviewer [-h] [--port PORT] imgpath

Provide simple interface to label bee images

positional arguments:
  imgpath      Path to images

options:
  -h, --help   show this help message and exit
  --port PORT  Port
```

# Output
As it runs it outputs a list of all the files it is processing. After each file it records a `.` or a `x` for each bright point it's considered. Ones that reach the threshold (the `x`s) will be added to the json label file.

Example:
```/home/mike/Documents/Research/rsync_bee/test/beephotos/2023-06-29/sessionA/setA/cam5/02D49670796/photo_object_02D49670796_20230629_10:32:31.586358__0014.np .....
/home/mike/Documents/Research/rsync_bee/test/beephotos/2023-06-29/sessionA/setA/cam5/02D49670796/photo_object_02D49670796_20230629_10:32:31.841386__0015.np x....
/home/mike/Documents/Research/rsync_bee/test/beephotos/2023-06-29/sessionA/setA/cam5/02D49670796/photo_object_02D49670796_20230629_10:32:32.136017__0016.np .....
/home/mike/Documents/Research/rsync_bee/test/beephotos/2023-06-29/sessionA/setA/cam5/02D49670796/photo_object_02D49670796_20230629_10:32:32.457968__0017.np x....
/home/mike/Documents/Research/rsync_bee/test/beephotos/2023-06-29/sessionA/setA/cam5/02D49670796/photo_object_02D49670796_20230629_10:32:32.742483__0018.np x....```

# Future
Depending on state of btviewer we might retire this tool.
