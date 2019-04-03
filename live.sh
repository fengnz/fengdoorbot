# 如果你要使用这个自动布署, 在git bash 里使用 ./run.sh
# deployId 改成你自己布署清单里的某个布署的ID， 这个布署的URL应该是和你的测试机器人绑定的
# 你也可以布署到你的LIVE机器人deploy id, 但不建议这么做
# 注意，如果你的机器人绑定的URL是Head Deployment 的URL，将无法使用以下代码
#Live
deployId=AKfycbwGJegZbUzaJSIIKQrXLLVmMPrGH1zxJZffN3jKh5Q5_TBMkv9nC1rVbF0Qzq0GVdfN
clasp push
# A=`clasp version debug`
# version=`echo $A | cut -d 'd' -f2 | cut -d ' ' -f3 | cut -d '.' -f1` 
# echo $B
clasp deploy --deploymentId $deployId 