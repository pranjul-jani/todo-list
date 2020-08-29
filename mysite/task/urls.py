from django.urls import path
from task.views import TaskList, TaskComplete, TaskDelete

urlpatterns = [
    path('', TaskList.as_view(), name='task_list'),
    path('tasks/<str:id>/completed/', TaskComplete.as_view(), name='task_completed'),
    path('tasks/<str:id>/delete/', TaskDelete.as_view(), name='task_delete'),
]