# Generated by Django 3.0.6 on 2021-03-20 20:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Chat', '0019_auto_20210320_0024'),
    ]

    operations = [
        migrations.RenameField(
            model_name='privatemessage',
            old_name='user_id',
            new_name='user',
        ),
    ]