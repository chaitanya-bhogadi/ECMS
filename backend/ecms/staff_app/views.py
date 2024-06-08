from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Application, ApplicationTracker, Reviewer
from .serializers import (
    ApplicantSerializer,
    PostReviewerSerializer,
    ApplicationTrackerSerializer,
    PostApplicationSerializer,
    PostApplicationTrackerSerializer,
)
from .filters import ApplicationTrackerFilter
from .pagination import CustomPagination


# Create your views here.
@api_view(["POST"])
def register_applicant(request):

    try:
        serializer = ApplicantSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Successfuly registered"},
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "status": False,
                "message": "Failed to register",
                "error": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        return Response(
            {
                "message": "Something went wrong issue with the server",
                "error": str(e),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def register_reviewer(request):

    try:
        serializer = PostReviewerSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Successfuly registered"},
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "message": "Failed to register",
                "error": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        return Response(
            {
                "message": "Something went wrong issue with the server",
                "error": str(e),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def application_views(request):

    if request.method == "POST":
        try:
            request.data["applicant"] = request.user.id
            serializer = PostApplicationSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Successfuly registered"},
                    status=status.HTTP_201_CREATED,
                )

            return Response(
                {
                    "message": "Failed to register",
                    "error": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {
                    "message": "Something went wrong issue with the server",
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    elif request.method == "PATCH":
        try:
            # Get the Application object
            application_obj = get_object_or_404(Application, id=request.data["id"])

            if application_obj.applicant.id != request.user.id:
                return Response(
                    {
                        "status": False,
                        "message": "You do not have permission to edit this resource.",
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            del request.data["id"]
            # Serialize the Application object with the updated data
            serializer = PostApplicationSerializer(
                instance=application_obj, data=request.data, partial=True
            )

            # If the serializer is valid, save the data and return a success
            # response
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "message": f"{list(request.data.keys())} are updated",
                    },
                    status=status.HTTP_205_RESET_CONTENT,
                )

            # If the serializer is not valid, return an error response with the
            # validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # If there is an exception,  return an error response with the error message
            return Response(
                {
                    "message": "Something went wrong issue with the server",
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    elif request.method == "DELETE":
        try:
            application_obj = Application.objects.get(id=request.GET.get("id", ""))
            application_obj.delete()
        except Exception as e:
            return Response(
                {
                    "message": "Something went wrong issue with the server",
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def application_track_views(request):

    if request.method == "POST":
        try:
            request.data["reviewer"] = request.user.id
            serializer = PostApplicationTrackerSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Successfuly registered"},
                    status=status.HTTP_201_CREATED,
                )

            return Response(
                {
                    "message": "Failed to register",
                    "error": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {
                    "message": "Something went wrong issue with the server",
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    elif request.method == "PATCH":
        try:
            # Get the Application Track object
            application_track_obj = get_object_or_404(
                ApplicationTracker, id=request.data["id"]
            )

            if (
                application_track_obj.reviewer.id != request.user.id
                and not application_track_obj.reviewer.is_super_user
            ):
                return Response(
                    {
                        "status": False,
                        "message": "You do not have permission to edit this resource.",
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            del request.data["id"]
            # Serialize the Application Track object with the updated data
            serializer = PostApplicationTrackerSerializer(
                instance=application_track_obj, data=request.data, partial=True
            )

            # If the serializer is valid, save the data and return a success
            # response
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "message": f"{list(request.data.keys())} are updated",
                    },
                    status=status.HTTP_205_RESET_CONTENT,
                )

            # If the serializer is not valid, return an error response with the
            # validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # If there is an exception,  return an error response with the error message
            return Response(
                {
                    "message": "Something went wrong issue with the server",
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    elif request.method == "DELETE":
        try:
            application_track_obj = ApplicationTracker.objects.get(
                id=request.GET.get("id", "")
            )
            application_track_obj.delete()
        except Exception as e:
            return Response(
                {
                    "message": "Something went wrong issue with the server",
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


class AllApplicationTrackAPIView(ListAPIView):

    def get_queryset(self):
        reviewer_object = get_object_or_404(Reviewer, id=self.request.user.id)
        if reviewer_object.is_super_user:
            queryset = ApplicationTracker.objects.all()
        else:
            queryset = ApplicationTracker.objects.filter(reviewer=reviewer_object)

        return queryset

    serializer_class = ApplicationTrackerSerializer
    # Set the permission classes to require authentication
    permission_classes = [IsAuthenticated]
    # Set the pagination class to CustomPagination
    pagination_class = CustomPagination
    # Set the filter backends to use DjangoFilterBackend, SearchFilter, and
    # OrderingFilter
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    # Set the filterset class to ApplicationTrackerFilter to use custom filtering
    filterset_class = ApplicationTrackerFilter
    # Set the search fields to search for in the ApplicationTracker model
    search_fields = [
        "application__applicant__username",
        "application__applicant__state",
        "application__applicant__district",
        "application__applicant__pincode",
        "application__applicant__id",
        "application__applicant_ownership",
        "application__govt_id_type",
        "application__category",
        "application__date_of_application",
        "modified_date",
        "status",
    ]
    # Set the ordering fields  ('-' prefix for reverse order)
    ordering_fields = ["application__applicant__date_of_application", "status"]


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):

    try:
        # Get the refresh token from the request data
        refresh_token = request.data["refresh_token"]

        # Create a RefreshToken object with the refresh token
        token = RefreshToken(refresh_token)

        # Blacklist the refresh token to invalidate it
        token.blacklist()

        # Return a success response with a status code of 205
        return Response(
            {"message": "Successfully logged out"},
            status=status.HTTP_205_RESET_CONTENT,
        )

    except Exception as _e:
        # If there is an exception while logging out, log the exception with
        # request user ID and return a bad request response with a status code of
        # 400
        return Response({"error": str(_e)}, status=status.HTTP_400_BAD_REQUEST)
