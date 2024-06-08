from django_filters import FilterSet, CharFilter, filters
from .models import ApplicationTracker


# Define a custom filter that is not required by default
class OptionalFilter(filters.Filter):
    required = False


# Define a custom filter set that uses the OptionalFilter class
class OptionalFilterSet(FilterSet):
    base_filter_class = OptionalFilter


# Define a filter set for the Customer model that extends the OptionalFilterSet class
class ApplicationTrackerFilter(OptionalFilterSet):
    # Define filters for specific fields of the Customer model
    status = CharFilter(field_name="status")
    modified_date = CharFilter(field_name="modified_date")

    class Meta:
        model = ApplicationTracker

        # Define the available filter fields for the Customer model
        fields = {
            "status": ["exact"],
            "modified_date": ["exact", "lt", "gt"],
            "application__date_of_application": ["exact", "lt", "gt"],
        }
