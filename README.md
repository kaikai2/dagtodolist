dagtodolist
===========

todo list应当具有表达依赖关系的能力：为了完成一件事，需要先完成其它几件事。

很多时候，一开始并不知道一件事情该如何完成，在做的时候才意识到需要借助其他人的帮助。

为了能将一件复杂的任务有条理的分解，并由一个团队协作逐步完成，需要有这样一个系统来维护每个人要做的事情的清单。

每个人的清单都是一个具有优先级的todo list，其中每一项或者是自己自发的添加的，或者是由于其它人为了完成手头的工作需要寻求你的帮助而推送给你的。
一个团队，可以观察整个系统内某一个任务的所有依赖子任务的DAG（有向无环图）结构。并获得关键路径上各任务估计完成时间的总和，从而判断这个任务的完成期限。也可以通过观察关键路径，得到一个关键任务集合，从而适时地调整团队资源的分配，以便优化任务的完成情况。
我称这样一个系统为 DAGtodoList

demo体验：http://dagtodolist.duapp.com/index.html
