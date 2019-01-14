#!/bin/bash
npm run build:page
echo "Building Successful!"

rm -rf /home/wwwroot/fxxkdspider.xyz/*
echo "Remove old assest Successful!"

mv /root/Projects/FxxkSpider/src/page/build/* /home/wwwroot/fxxkdspider.xyz/
echo "Move new assest Successful!"
