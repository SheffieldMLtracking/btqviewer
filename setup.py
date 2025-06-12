from distutils.core import setup
setup(
  name = 'btqviewer',
  packages = ['btqviewer'],
  version = '0.1',
  description = 'Tool for viewing the tags from the bee track project',
  author = 'Mike Smith',
  author_email = 'm.t.smith@sheffield.ac.uk',
  url = 'https://github.com/SheffieldMLtracking/btqviewer.git',
  download_url = 'https://github.com/SheffieldMLtracking/btqviewer.git',
  keywords = ['bumblebees','ecology','tracking','retroreflectors'],
  classifiers = [],
  install_requires=['numpy','flask','flask_cors'],
  scripts=['bin/btqviewer','bin/btcopy'],
)
