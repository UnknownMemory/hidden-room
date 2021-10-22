from rest_framework import serializers

from django.contrib.auth.models import User
from django.shortcuts import render, get_object_or_404, get_list_or_404

from .models import Profile, Friend
from Chat.models import PrivateChatroom


class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(min_length=8, max_length=100, write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'confirm_password', 'is_staff']
        extra_kwargs = {'password': {'write_only': True}, 'is_staff': {'read_only': False}}
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        profile = Profile.objects.create(user=user)

        return user

    def validate(self, data):
        if(data.get('password') != data.get('confirm_password')):
            raise serializers.ValidationError({"password":"Passwords don't match"})
        return data

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)

        password = validated_data.get('password', None)
        if(password != None):
            instance.set_password(password)
        
        instance.save()
        return instance


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar', 'status']


class AccountSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(many=False, read_only=True)
    class Meta:
        model = User
        fields = ['username', 'profile', 'is_staff']
        read_only_fields = ['id', 'username', 'is_staff']


class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = ['id', 'user_id', 'user2_id', 'relationship']
        extra_kwargs = {'since': {'read_only': True}}

    def create(self, validated_data):
        data = dict(validated_data)
        data['relationship'] = "PENDING"
        obj = Friend.objects.create(**data)
        obj.save()
        return obj

    def update(self, instance, validated_data):
        user = self.context['request'].user
        print(instance.user2_id.id, user.pk)
        if(user.pk != instance.user_id.id and user.pk != instance.user2_id.id):
            raise serializers.ValidationError({"authorize": "You don't have permission for this."})

        instance.relationship = validated_data.get('relationship', instance.relationship)

        if(instance.relationship == 'FRIENDS'):
            PrivateChatroom.objects.create(user1=instance.user_id, user2=instance.user2_id)
        instance.save()
        return instance