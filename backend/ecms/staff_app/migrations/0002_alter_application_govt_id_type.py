# Generated by Django 4.1.3 on 2024-06-08 19:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('staff_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='govt_id_type',
            field=models.CharField(choices=[('aadhar', 'Aadhar'), ('pan', 'Pan'), ('passport', 'Passport'), ('voterid', 'Voterid')], max_length=10),
        ),
    ]