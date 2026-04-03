class ServiceError(Exception):
    """Base class for service-layer errors."""


class InvalidInputError(ServiceError):
    """Raised when required service input is missing or malformed."""


class NotFoundError(ServiceError):
    """Raised when a requested resource does not exist."""


class ConflictError(ServiceError):
    """Raised when a request conflicts with the current state."""


class NoRoomsAvailableError(ServiceError):
    """Raised when no room can be allocated for the request."""
