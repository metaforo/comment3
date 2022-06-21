#!/bin/sh

rsync -av --progress ~/everforo.com.ui2/ ./vueold/ --exclude ~/everforo.com.ui2/node_modules --exclude ~/everforo.com.ui2/dist