# -*- coding: utf-8 -*-
"""
Created on Sun Oct 20 22:00:21 2024

@author: kevin
"""

import os
import json

file = "pokemon.json"

with open(file, "r") as f:
    pokemon = json.load(f)
    for p in pokemon:
        id_ = p['id']
        img = p['img']
        #os.rename(os.getcwd()+"\\images\\"+img, os.getcwd()+"\\images\\"+str(id_)+".png")
        del p['img']
    with open(file, "w") as f1:
        json.dump(pokemon, f1)      
    f.close()
    f1.close()


