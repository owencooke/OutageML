from django.urls import path
from .views import (
    TransformerCreate,
    TransformerList,
    TransformerDetail,
    TransformerUpdate,
    TransformerDelete,
)

urlpatterns = [
    path("create/", TransformerCreate.as_view(), name="create-transformer"),
    path("", TransformerList.as_view()),
    path("<int:pk>/", TransformerDetail.as_view(), name="retrieve-transformer"),
    path("update/<int:pk>/", TransformerUpdate.as_view(), name="update-transformer"),
    path("delete/<int:pk>/", TransformerDelete.as_view(), name="delete-transformer"),
]
