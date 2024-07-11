# btqviewer
An alternative viewer for the bee tracking project

# Install
```pip install git+https://github.com/SheffieldMLtracking/btqviewer.git```

# Usage
If one passes it a path somewhere inside a tree of a day's work, e.g.
```btqviewer ~/Documents/Research/rsync_bee/test/beephotos/2023-06-29/sessionA/setA/```
it will then open the root of that tree, and give you the option to select the session, set, box and camera:
![image](https://github.com/SheffieldMLtracking/btqviewer/assets/7914304/4c59e250-e881-4f33-9463-eb7d23d1aee3)


```
usage: btqviewer [-h] [--port PORT] imgpath

Provide simple interface to label bee images

positional arguments:
  imgpath      Path to images

options:
  -h, --help   show this help message and exit
  --port PORT  Port
```

# Future
Depending on state of btviewer we might retire this tool.
