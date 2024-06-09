from django.urls import path
from . import views

urlpatterns = [
    path("auth/signup/", views.register_reviewer),
    path("auth/applicant/signup/", views.register_applicant),
    path("application/", views.application_views),
    path("track_application/", views.application_track_views),
    path("applications/",views.AllApplicationTrackAPIView.as_view()),
    path("auth/logout/", views.logout),
    path("monthly_stats/", views.get_all_months_stats),
]