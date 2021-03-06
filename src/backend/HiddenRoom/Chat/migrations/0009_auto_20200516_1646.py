# Generated by Django 3.0.6 on 2020-05-16 14:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Chat', '0008_auto_20200516_1639'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatroom',
            name='creation_date',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='privatechatroom',
            name='creation_date',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='chatroom',
            name='name',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.CreateModel(
            name='ChatroomUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('joined_date', models.DateTimeField(auto_now=True)),
                ('chatroom_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Chat.Chatroom')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
