# Generated by Django 4.1.3 on 2024-06-08 14:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import staff_app.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('username', models.CharField(help_text='Required. 64 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=64, validators=[staff_app.models.MyValidator()], verbose_name='username')),
                ('email', models.EmailField(max_length=320, null=True, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('applicant_ownership', models.CharField(choices=[('joint', 'Joint'), ('individual', 'Individual')], max_length=10)),
                ('govt_id_type', models.CharField(choices=[('aadhar', 'Aadhar'), ('pan', 'Pan'), ('password', 'Password'), ('voterid', 'Voterid')], max_length=10)),
                ('id_number', models.CharField(max_length=50)),
                ('category', models.CharField(choices=[('commercial', 'Commercial'), ('residential', 'Residential')], max_length=15)),
                ('load_applied', models.PositiveIntegerField(help_text='Load applied in KV (should not exceed 200 KV)')),
                ('date_of_application', models.DateField()),
                ('date_of_approval', models.DateField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Applicant',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('gender', models.CharField(choices=[('male', 'Male'), ('female', 'Female')], max_length=10)),
                ('district', models.CharField(max_length=255)),
                ('state', models.CharField(max_length=255)),
                ('pincode', models.IntegerField()),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            bases=('staff_app.user',),
        ),
        migrations.CreateModel(
            name='Reviewer',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('is_super_user', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            bases=('staff_app.user',),
        ),
        migrations.CreateModel(
            name='ApplicationTracker',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('modified_date', models.DateField(auto_now=True)),
                ('status', models.CharField(choices=[('approved', 'Approved'), ('pending', 'Pending'), ('rejected', 'Rejected'), ('connection_released', 'Connection Released')], max_length=20)),
                ('reviewer_comments', models.TextField(blank=True, null=True)),
                ('application', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='trackers', to='staff_app.application')),
                ('reviewer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviewed_applications', to='staff_app.reviewer')),
            ],
        ),
        migrations.AddField(
            model_name='application',
            name='applicant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='staff_app.applicant'),
        ),
    ]