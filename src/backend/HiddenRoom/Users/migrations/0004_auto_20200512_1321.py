# Generated by Django 3.0.6 on 2020-05-12 11:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0003_auto_20200512_1320'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='status',
            field=models.CharField(blank=True, max_length=42),
        ),
    ]