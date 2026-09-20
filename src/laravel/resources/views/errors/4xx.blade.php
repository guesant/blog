<x-errors.page
    :code="$exception->getStatusCode()"
    :title="__('errors.generic.title')"
    :description="__('errors.generic.description')"
/>
