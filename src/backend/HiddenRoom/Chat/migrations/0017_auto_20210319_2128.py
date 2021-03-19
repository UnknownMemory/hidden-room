# Generated by Django 3.0.6 on 2021-03-19 20:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Chat', '0016_auto_20201202_1757'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='privatemessage',
            name='content',
        ),
        migrations.AlterField(
            model_name='privatemessage',
            name='id',
            field=models.BigIntegerField(primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='privatemessage',
            name='message',
            field=models.TextField(),
        ),
        migrations.DeleteModel(
            name='Message',
        ),
    ]
