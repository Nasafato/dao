#!/bin/bash

# Copy this to `public/audio` and run it to rename all wav files to dao01.wav, dao02.wav, etc.

# Get a list of all wav files in the current directory
files=$(ls | grep ".wav$")

# Loop over each file and rename it to daoX.wav
counter=1
for file in $(echo $files | tr " " "\n" | sort)
do
  mv $file dao$(printf "%02d" $counter).wav
  ((counter++))
done
