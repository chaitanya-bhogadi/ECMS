from rest_framework import pagination


class CustomPagination(pagination.PageNumberPagination):
    page_size = 25  # default page size
    page_size_query_param = 'count'
    max_page_size = 100  # max page size
    page_query_param = 'p'
