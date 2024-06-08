from rest_framework import serializers
from .models import Applicant, Reviewer, Application, ApplicationTracker


class ApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = ["username", "email", "gender", "district", "state", "pincode"]


class PostReviewerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reviewer
        fields = ["username", "email", "password"]


class ReviewerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reviewer
        fields = ["username", "email", "is_super_user"]


class ApplicationSerializer(serializers.ModelSerializer):
    applicant = ApplicantSerializer(read_only=True)

    class Meta:
        model = Application
        fields = [
            "applicant",
            "applicant_ownership",
            "govt_id_type",
            "id_number",
            "category",
            "load_applied",
            "date_of_application",
            "date_of_approval",
        ]
        read_only_fields = ["date_of_application", "govt_id_type", "id_number"]


class PostApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application
        fields = "__all__"

    def validate_load_applied(self, value):
        """
        Check that the load applied does not exceed 200 KV.
        """
        if value > 200:
            raise serializers.ValidationError("The load applied cannot exceed 200 KV.")
        return value


class ApplicationTrackerSerializer(serializers.ModelSerializer):
    application = ApplicationSerializer(read_only=True)
    reviewer = ReviewerSerializer(read_only=True)

    class Meta:
        model = ApplicationTracker
        fields = [
            "id",
            "application",
            "reviewer",
            "status",
            "reviewer_comments",
            "modified_date",
        ]


class PostApplicationTrackerSerializer(serializers.ModelSerializer):

    class Meta:
        model = ApplicationTracker
        fields = "__all__"
