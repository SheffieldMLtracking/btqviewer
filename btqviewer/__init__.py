import os
from glob import glob
from btretrodetect import ColourRetrodetect
import json
from pathlib import Path
import numpy as np


def copy_labels(base_path, MtoC=True, sourcename=None, helpmsg=False):
    """
    Copies the label data from the monochrome camera image set to the colour one, or vice versa.
    base_path: The location of the set we want to do this to.
    MtoC: which way to copy (mono to colour? default=True)
    sourcename: optional -- can be:
     - a string, e.g. set to only copy 'btviewer' labels
     - a list, e.g. set to to only copy ['btviewer','btretrodetect'] labels
     - None (default) = copy any that it finds.
    """
    
    try:
        monopath = glob(base_path+'/M-*')[0]
        colourpath = glob(base_path+'/C-*')[0]
    except Exception as e:
        if helpmsg: print("Didn't find either the source or destination folder in %s" % base_path)
        return
        
    camid = colourpath.split(os.sep)[-1]
    try:
        crd = ColourRetrodetect(camid=camid)
    except:
        print("Skipping %s" % base_path)
        return
    offset = np.array(crd.offset)
    
    if not MtoC: offset=-offset #need to move in the other direction
    sourcepath = monopath if MtoC else colourpath
    destpath = colourpath if MtoC else monopath
    
    if sourcename is None:
        sources = glob(sourcepath+'/*/')
    else:
        if type(sourcename)==str: sourcename = [sourcename]
        sources = [sourcepath+'/'+sn+'/' for sn in sourcename]
    
    for source in sources:
        dest = os.sep.join(destpath.split(os.sep)+source.split(os.sep)[-2:-1])+'_copy/'
        print("================================")
        print("Copying from %s to %s" % (source,dest))
    
    
        Path(dest).mkdir(parents=True, exist_ok=True)
        for jsonfilename in sorted(glob(source+'/*json')):
            data = json.load(open(jsonfilename,'rb'))
        
            
            for d in data:
                d['x']=int(d['x']+offset[0])
                d['y']=int(d['y']+offset[1])
            
            destjsonfilename = dest+jsonfilename.split(os.sep)[-1]
            #json.save(open(destjsonfilename,'wb'))
            #print("Transferring data from: \n%s \nto \n%s\n" % (jsonfilename,destjsonfilename))
            print(".",end="")
            json.dump(data,open(destjsonfilename,'w'))
        print("")
