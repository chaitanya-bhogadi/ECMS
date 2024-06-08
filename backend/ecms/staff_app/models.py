from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.validators import UnicodeUsernameValidator

# Create your models here.

class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """

    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self.create_user(email, password, **extra_fields)


class MyValidator(UnicodeUsernameValidator):
    """
    Custom username validator to accept spaces in the username
    """

    regex = r"^[\w.@+\- ]+$"


class User(AbstractUser):
    """
    Custom user model that extends Django's built-in `AbstractUser` model.

    Fields:
        username (CharField): Unique username field with a max length of 64 characters.
        email (EmailField): Unique email field with a max length of 320 characters.
        created_at (DateTimeField): DateTime field when the object is created.
        updated_at (DateTimeField): DateTime field that automatically updates on save.

    Uses a custom manager called `CustomUserManager`.

    The `__str__()` method returns the username of the user instance.

    The `USERNAME_FIELD` is set to "email", making email the unique identifier for authentication.
    The `REQUIRED_FIELDS` is set to ["username"], making username a required field during user creation.
    """

    username_validator = MyValidator()
    username = models.CharField(
        ("username"),
        max_length=64,
        help_text=(
            "Required. 64 characters or fewer. Letters, digits and @/./+/-/_ only."
        ),
        validators=[username_validator],
    )
    email = models.EmailField(unique=True, null=True, max_length=320)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        self.password = make_password(self.password)
        super(User, self).save(*args, **kwargs)


class GenderChoices(models.TextChoices):
    """
    Choices for gender.
    """

    MALE = 'male'
    FEMALE = 'female'


class Applicant(User):
    """
    Applicant model that extends the custom user model.

    Fields:
        gender (CharField): Gender of the applicant.
        district (CharField): District of the applicant.
        state (CharField): State of the applicant.
        pincode (IntegerField): Pincode of the applicant.
    """

    gender = models.CharField(max_length=10, choices=GenderChoices.choices)
    district = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    pincode = models.IntegerField()


class Reviewer(User):
    """
    Reviewer model that extends the custom user model.

    Fields:
        is_super_user (BooleanField): Whether the reviewer is a super user.
    """

    is_super_user = models.BooleanField(default=False)


class ApplicantOwnershipChoices(models.TextChoices):
    """
    Choices for applicant ownership.
    """

    JOINT = 'joint'
    INDIVIDUAL = 'individual'


class GovtIDTypeChoices(models.TextChoices):
    """
    Choices for government ID type.
    """

    AADHAR = 'aadhar'
    PAN = 'pan'
    PASSPORT = 'passport'
    VOTERID = 'voterid'


class CategoryChoices(models.TextChoices):
    """
    Choices for category.
    """

    COMMERCIAL = 'commercial'
    RESIDENTIAL = 'residential'


class ConnectionStatus(models.TextChoices):
    """
    Choices for connection status.
    """

    APPROVED = 'approved'
    PENDING = 'pending'
    REJECTED = 'rejected'
    CONNECTION_RELEASED = 'connection_released'


class Application(models.Model):
    """
    Application model for electricity connection.

    Fields:
        applicant (ForeignKey): The applicant who applied for the connection.
        applicant_ownership (CharField): The ownership type of the applicant.
        govt_id_type (CharField): The type of government ID.
        id_number (CharField): The ID number of the applicant.
        category (CharField): The category of the connection.
        load_applied (PositiveIntegerField): The load applied in KV.
        date_of_application (DateField): The date of application.
        date_of_approval (DateField): The date of approval.
    """

    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE, related_name="applications")
    applicant_ownership = models.CharField(max_length=10, choices=ApplicantOwnershipChoices.choices)
    govt_id_type = models.CharField(max_length=10, choices=GovtIDTypeChoices.choices)
    id_number = models.CharField(max_length=50)
    category = models.CharField(max_length=15, choices=CategoryChoices.choices)
    load_applied = models.PositiveIntegerField(
        help_text='Load applied in KV (should not exceed 200 KV)',)
    date_of_application = models.DateField()
    date_of_approval = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Application ID: {self.id} by {self.applicant.username}"


class ApplicationTracker(models.Model):
    """
    Application tracker model for tracking the status of an application.

    Fields:
        application (ForeignKey): The application being tracked.
        reviewer (ForeignKey): The reviewer who reviewed the application.
        status (CharField): The status of the application.
        reviewer_comments (TextField): The comments of the reviewer.
        modified_date (DateField): The date of last modification.
    """

    application = models.OneToOneField(Application, on_delete=models.CASCADE, related_name="trackers")
    reviewer = models.ForeignKey(Reviewer, on_delete=models.CASCADE, related_name="reviewed_applications")
    modified_date = models.DateField(auto_now=True)
    status = models.CharField(max_length=20, choices=ConnectionStatus.choices)
    reviewer_comments = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Tracker for Application Tracking ID: {self.application.id}"