from django.db.models import Q
from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import viewsets, generics, authentication, permissions, response, status
from rest_framework.authtoken.views import ObtainAuthToken, APIView
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import NotFound

from .serializers import ProfileSerializer, UserSerializer, FriendSerializer, AccountSerializer
from django.contrib.auth.models import User
from .models import Profile, Friend


class AccountDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]

    def retrieve(self, request, *args, **kwargs):
        self.object = get_object_or_404(User, id=self.request.user.id)
        serializer = self.get_serializer(self.object)
        return response.Response(serializer.data)


class FriendDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = AccountSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        self.object = get_object_or_404(Profile, user=self.request.user)
        return response.Response({
            'id': self.object.user.id,
            'username': self.object.user.username,
            'avatar': self.object.avatar,
            'status': self.object.status,
        })


class FriendViewSet(viewsets.ModelViewSet):
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
     
    def create(self, request, *args, **kwargs):
        data = dict(request.data)
        data['user_id'] = self.request.user.id
        data['user2_id'] = User.objects.get(username=data['username'][0]).id
        data.pop('username')

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return response.Response(serializer.data, headers=headers)

    def perform_create(self, serializer):
        serializer.save()
    
    def retrieve(self, request):
        queryset = Friend.objects.filter(Q(user_id=self.request.user) | Q(user2_id=self.request.user))
        serializer = FriendSerializer(queryset, many=True, context={'request': request})
        return response.Response(serializer.data)


class AccountCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class UpdateAccount(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]


class CheckEmail(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        email = User.objects.filter(email=request.query_params['email']).exists()
        if(email):
            return response.Response('An account is already registered with that email.')
        else:
            return response.Response(True)

class CheckUsername(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        username = User.objects.filter(username=request.query_params['username']).exists()
        if(username):
            return response.Response('That username is already taken.')
        else:
            return response.Response(True)

class GetToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})

        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token = Token.objects.get(user=user)
        
        return response.Response({
            'token': token.key,
        })
