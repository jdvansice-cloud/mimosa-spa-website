Appointment
```
GET /public/v{version}/appointment/activesessiontimes Get active session times.
```
Model Example Value
MINDBODY Public API
Implementation Notes
This is not appointment availability but rather the active business hours for studios and which increments services can be
booked at. See BookableItems for appointment availability.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"ActiveSessionTimes": [
"string"
]
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.endTime Filters results to times that
end on or before this time
on the current date. Any
date provided is ignored..
```
Default: 23:59:59
```
query date-time
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to 0. query integer
request.scheduleType Filters on the provided the
schedule type. Either
SessionTypeIds or
ScheduleType must be
provided.
query string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 1/181
```
Try it out!
```
GET /public/v{version}/appointment/addons Get add ons
```
Model Example Value
Parameter Value Description ParameterType Data Type
request.sessionTypeIds Provide
multiple
values in
new lines.
Filters on the provided
session type IDs. Either
SessionTypeIds or
ScheduleType must be
provided.
query Array[integer]
request.startTime Filters results to times that
start on or after this time
on the current date. Any
date provided is ignored.
```
Default: 00:00:00
```
query date-time
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
Get active appointment add-ons.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"AddOns": [
```
{
```
"Id": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 2/181
```
Try it out!
```
GET /public/v{version}/appointment/appointmentoptions Get appointment-related settings.
```
Model Example Value
Parameter Value Description ParameterType Data Type
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to 0. query integer
request.staffId Filter to add-ons only
performed by this staff
member.
query integer
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint has no query parameters.
```
Response Class (Status 200)
```
OK
```
{
```
"Options": [
```
{
```
"DisplayName": "string",
"Name": "string",
"Value": "string",
"Type": "string"
```
}
```
]
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
siteId -99 ID of the site from which header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 3/181
```
Try it out!
```
GET /public/v{version}/appointment/availabledates
```
Get dates where there is scheduled appointment availability for the given session types.
Model Example Value
Parameter Value Description ParameterType Data Type
to pull data.
```
version (required) path string
```
Implementation Notes
Returns a list of dates to narrow down staff availability when booking. Dates are those which staff are scheduled to work and
do not guarantee booking availabilities. After this call is made, use GET BookableItems to retrieve availabilities for specific
dates before booking.
```
Response Class (Status 200)
```
OK
```
{
```
"AvailableDates": [
"2026-01-12T22:22:46.340Z"
]
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.endDate The end date of the
requested date range.
```
Default: StartDate
```
query date-time
request.locationId optional requested
location ID.
query integer
request.staffId optional requested staff
ID.
query long
request.startDate The start date of the
requested date range. If
omitted, the default is
query date-time
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 4/181
```
Try it out!
```
GET /public/v{version}/appointment/bookableitems Get staff appointment availability.
```
Model Example Value
Parameter Value Description ParameterType Data Type
used.
```
Default: today’s date
```
version 6 version of the api. header string
```
request.sessionTypeId (required) required requested
```
session type ID.
query integer
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
Returns a list of availabilities with the information needed to book appointments. Availabilities include information such as the
location and its amenities, staff members, programs, and session types. Recommended to use with GET AvailableDates to
see what dates the staff is scheduled to work and narrow down the dates searched. Recommended to use with GET
ActiveSessionTimes to see which increments each business allows for booking appointments. Notes:
With a wider range of dates, this call may take longer to return results.
With a higher number of request.sessionTypeIds, this call may take longer to return results.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Availabilities": [
```
{
```
"Id": 0,
```
{
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 5/181
```
Parameter Value Description ParameterType Data Type
request.appointmentId If provided, filters
out the
appointment with
this ID.
query long
request.endDate The end date of
the requested date
range.
```
Default: StartDate
```
query date-time
request.ignoreDefaultSessionLength When true ,
availabilities that
are non-default
return, for
example, a 30-
minute availability
with a 60-minute
default session
length.
When false ,
only availabilities
that have the
default session
length return.
query boolean
request.includeResourceAvailability When true ,
resource
availabilities for the
session type are
returned.
When false ,
resource
availabilities are
not returned
default.
query boolean
request.limit Number of results
to include, defaults
to 100
query integer
request.locationIds Provide
multiple
values in
new lines.
A list of the
requested location
IDs.
query Array[integer]
request.offset Page offset,
defaults to 0.
query integer
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 6/181
```
Try it out!
```
GET /public/v{version}/appointment/scheduleitems Get appointment schedule.
```
Model Example Value
Parameter Value Description ParameterType Data Type
request.staffIds Provide
multiple
values in
new lines.
A list of the
requested staff
IDs. Omit
parameter to return
all staff
availabilities.
query Array[long]
request.startDate The start date of
the requested date
range.
```
Default: today’s
```
date
query date-time
version 6 version of the api. header string
request.sessionTypeIds Provide
multiple
values in
new lines
```
(at least
```
one
```
required).
```
A list of the
requested
session type IDs.
query Array[integer]
siteId -99 ID of the site from
which to pull
data.
header string
```
version (required) path string
```
Implementation Notes
Returns a list of schedule items, including appointments, availabilities, and unavailabilities. Unavailabilities are the times at
which appointments cannot be booked, for example, on holidays or after hours when the business is closed.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"StaffMembers": [
```
{
```
"Address": "string",
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 7/181
```
Try it out!
```
GET /public/v{version}/appointment/staffappointments Get appointments grouped by staff member.
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.endDate The end date of the
requested date range.
```
Default: today’s date
```
query date-time
request.ignorePrepFinishTimes When true ,
appointment
preparation and finish
unavailabilities are
not returned.
```
Default: false
```
query boolean
request.limit Number of results to
include, defaults to
100
query integer
request.locationIds Provide
multiple
values in
new lines.
A list of requested
location IDs.
query Array[integer]
request.offset Page offset, defaults
to 0.
query integer
request.staffIds Provide
multiple
values in
new lines.
A list of requested
staff IDs.
query Array[long]
request.startDate The start date of the
requested date range.
```
Default: today’s date
```
query date-time
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 8/181
```
Model Example Value
Implementation Notes
Returns a list of appointments by staff member.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Appointments": [
```
{
```
"GenderPreference": "None",
" i " 0
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.appointmentIds Provide
multiple
values in
new lines.
A list of the
requested
appointment IDs.
query Array[integer]
request.clientId The client ID to be
returned.
query string
request.endDate The end date of the
requested date
range.
```
Default: StartDate
```
query date-time
request.limit Number of results to
include, defaults to
100
query integer
request.locationIds Provide
multiple
values in
new lines.
A list of the
requested location
IDs.
query Array[integer]
request.offset Page offset, defaults query integer
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 9/181
```
Try it out!
```
GET /public/v{version}/appointment/unavailabilities
```
Returns a list of unavailabilities. Unavailabilities are the times at which appointments cannot be booked, for example, on holidays or after
hours when the business is closed.
Model Example Value
Parameter Value Description ParameterType Data Type
to 0.
request.staffIds Provide
multiple
values in
new lines.
List of staff IDs to be
returned. Omit
parameter to return
staff appointments
for all staff.
query Array[long]
request.startDate The start date of the
requested date
range. If omitted, the
default is used.
```
Default: today's
```
date
query date-time
request.useSiteSettingsStaffName When true , the
staff DisplayName
will be populated
based on site-level
settings. When
false or omitted,
the staff
DisplayName will
contain only the
FirstName.
query boolean
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Unavailabilities": [
```
{
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 10/181
```
Try it out!
```
POST /public/v{version}/appointment/addappointment Book a new appointment.
```
Model Example Value
"Id": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.endDate The end date of the
requested date range.
```
Default: today’s date
```
query date-time
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to 0. query integer
request.staffIds Provide
multiple
values in
new lines.
A list of requested staff
IDs.
query Array[long]
request.startDate The start date of the
requested date range.
```
Default: today’s date
```
query date-time
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
A user token is required for this endpoint. To book an appointment, you must use a location ID, staff ID, client ID, session type
ID, and the StartDateTime of the appointment. You can get most of this information using GET BookableItems.
```
Note: Request deduplication is enabled for this endpoint. More information can be found in the Request Deduplication Page.
```
Use the X-RequestDeduplication-Skip header to bypass deduplication if necessary. This may be useful in scenarios
where you want to ensure a new appointment is created regardless of previous identical requests.
```
Response Class (Status 200)
```
OK
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 11/181
```
Model Example Value
Try it out!
```
POST /public/v{version}/appointment/addappointmentaddon Add Appointment Add-On
```
```
{
```
```
"Appointment": {
```
"GenderPreference": "None",
"Duration": 0,
"ProviderId": "string",
"Id": 0,
"Status": "None",
"StartDateTime": "2026-01-12T22:22:46.368Z",
"EndDateTime": "2026-01-12T22:22:46.368Z",
"Notes": "string",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ApplyPayment": true,
"ClientId": "string",
"Duration": 0,
"EndDateTime": "2026-01-12T22:22:46.370
"GenderPreference": "string",
"LocationId": 0,
"Notes": "string",
"ProviderId": "string",
"ResourceIds": [
0
]
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint books an add-on on top of an existing, regular appointment. To book an add-on, you must use an existing
appointment ID and session type ID. You can get a session type ID using GET AppointmentAddOns .
```
Response Class (Status 201)
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 12/181
```
Model Example Value
Model Example Value
Try it out!
```
POST /public/v{version}/appointment/addmultipleappointments Book multiple appointments.
```
Created
```
{
```
"AppointmentId": 0,
"AddOnAppointmentId": 0
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ApplyPayment": true,
"AppointmentId": 0,
"SessionTypeId": 0,
"StaffId": 0,
"Test": true
```
}
```
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
A user token is required for this endpoint. To book appointments, you must provide a location ID, staff ID, client ID, session
type ID, and the StartDateTime for each appointment. You can retrieve most of this information using the GET BookableItems
endpoint. This endpoint will handle errors that occur during the appointment creation process and return a list of errors, as
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 13/181
```
Model Example Value
Model Example Value
Try it out!
well as the request object that generated each outcome. You can pass the AddAppointmentRequestId for each request, or it
will be automatically filled. This is intended to facilitate matching each request with the corresponding outcome. This endpoint
will send one notification when multiple Appointments are booked by one Client on a given day.
```
Response Class (Status 200)
```
OK
```
{
```
"AddAppointmentOutcomes": [
```
{
```
```
"Appointment": {
```
"GenderPreference": "None",
"Duration": 0,
"ProviderId": "string",
"Id": 0,
"Status": "None",
"StartDateTime": "2026-01-12T22:22:46.373Z",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"AddAppointmentRequests": [
```
{
```
"ApplyPayment": true,
"ClientId": "string",
"Duration": 0,
"EndDateTime": "2026-01-12T22:22:46
"GenderPreference": "string",
"LocationId": 0,
"Notes": "string",
"ProviderId": "string",
"R Id " [
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 14/181
```
```
POST /public/v{version}/appointment/availabilities Add Availabillity/Unavailabillity.
```
Model Example Value
Model Example Value
Implementation Notes
Add availabilities and unavailabilities for a staff member.
```
Note: You must have a staff user token with the required permissions.
```
```
Response Class (Status 200)
```
OK
```
{
```
"StaffMembers": [
```
{
```
"Id": 0,
"FirstName": "string",
"LastName": "string",
"DisplayName": "string",
"Email": "string",
"Bio": "string",
"Address": "string",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"Test": true,
"LocationID": 0,
"StaffIDs": [
0
],
"ProgramIDs": [
0
],
"StartDateTime": "2026-01-12T22:22:46.3
"EndDateTime": "2026-01-12T22:22:46.382
"D OfW k" [
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 15/181
```
Try it out!
```
PUT /public/v{version}/appointment/availabilities Update availability/unavailability of the staff
```
Model Example Value
Model Example Value
Implementation Notes
To update the information for a specific availability or unavailability of the staff.
```
Note: You must have a staff user token with the required permissions.
```
```
Response Class (Status 200)
```
OK
```
{
```
"StaffMembers": [
```
{
```
"Address": "string",
"AppointmentInstructor": true,
"AlwaysAllowDoubleBooking": true,
"Bio": "string",
"City": "string",
"Country": "string",
"Email": "string",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
siteId -99 ID of the
site from
which to
pull data.
header string
```
updateAvailabilityRequest (required)
```
Parameter content type:
application/json
body
```
{
```
"AvailabilityIds": [
0
],
"PublicDisplay": "Hide",
"DaysOfWeek": [
"Sunday"
],
"ProgramIds": [
0
],
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 16/181
```
Try it out!
```
POST /public/v{version}/appointment/updateappointment Update an existing appointment.
```
Model Example Value
Model Example Value
Parameter Value Description ParameterType Data Type
```
version (required) path string
```
Implementation Notes
To update the information for a specific appointment, you must have a staff user token with the proper permissions. Note that
you can only update the appointment’s StartDateTime , EndDateTime , StaffId , Notes , and SessionTypeId .
```
Response Class (Status 200)
```
OK
```
{
```
```
"Appointment": {
```
"GenderPreference": "None",
"Duration": 0,
"ProviderId": "string",
"Id": 0,
"Status": "None",
"StartDateTime": "2026-01-12T22:22:46.389Z",
"EndDateTime": "2026-01-12T22:22:46.389Z",
"Notes": "string",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"AppointmentId": 0,
"EndDateTime": "2026-01-12T22:22:46.391
"Execute": "string",
"GenderPreference": "string",
"Notes": "string",
"PartnerExternalId": "string",
"ProviderId": "string",
"ResourceIds": [
0
],
"S dE il" t
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 17/181
```
Try it out!
```
DELETE /public/v{version}/appointment/appointmentfromwaitlist Remove an appointment from waitlist
```
Try it out!
```
DELETE /public/v{version}/appointment/availability Delete availability/unavailability of the staff
```
Parameter Value Description ParameterType Data Type
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
request.waitlistEntryIds Provide
multiple
values in
new lines
```
(at least
```
one
```
required).
```
A list of
WaitlistEntryIds to
remove from the waiting
list.
query Array[integer]
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Response Messages
HTTP Status Code Reason Response Model Headers
204 This endpoint does not return a
response. If a call to this endpoint
results in a 204 No Content HTTP
status code, then the call was
successful.
Implementation Notes
This endpoint deletes the availability or unavailability. Note: You must have a staff user token with the required permissions.
Parameters
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 18/181
```
Try it out!
```
DELETE /public/v{version}/appointment/deleteappointmentaddon Early Cancel/Remove an Appointment Add-On
```
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
deleteAvailabilityRequest.availabilityId The ID of the
availability or
unavailability.
query integer
deleteAvailabilityRequest.test When true ,
indicates that this
is a test request
and no data is
deleted from the
subscriber’s
database. When
false , the
record will be
deleted. Default:
false
query boolean
version 6 version of the api. header string
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
Response Messages
HTTP Status Code Reason Response Model Headers
204 This endpoint does not return a
response. If a call to this endpoint
results in a 204 NoContent HTTP
status code, then the call was
successful.
Implementation Notes
This endpoint can be used to early-cancel a booked appointment add-on.
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 19/181
```
Try it out!
Class
```
GET /public/v{version}/class/classdescriptions Get class descriptions.
```
Model Example Value
Parameter Value Description ParameterType Data Type
```
id (required) query long
```
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Response Messages
HTTP Status Code Reason Response Model Headers
204 This endpoint does not return a
response. If a call to this endpoint
results in a 204 No Content HTTP
status code, then the call was
successful.
Implementation Notes
To find class descriptions associated with scheduled classes, pass StaffId , StartClassDateTime ,
EndClassDateTime , or LocationId in the request.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"ClassDescriptions": [
```
{
```
"Active": true,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 20/181
```
Parameter Value Description ParameterType Data Type
request.classDescriptionId The ID of the
requested client.
query integer
request.endClassDateTime Filters the results to
class descriptions for
scheduled classes
that happen before
the given date and
time.
query date-time
request.includeInactive Includes inactive
class descriptions,
defaulting to true.
When set to false, it
filters out inactive
class descriptions.
query boolean
request.limit Number of results to
include, defaults to
100
query integer
request.locationId Filters results to
classes descriptions
for schedule classes
as the given location.
query integer
request.offset Page offset, defaults
to 0.
query integer
request.programIds Provide
multiple
values in
new lines.
A list of requested
program IDs.
query Array[integer]
request.staffId Filters results to class
descriptions for
scheduled classes
taught by the given
staff member.
query long
request.startClassDateTime Filters the results to
class descriptions for
scheduled classes
that happen on or
after the given date
and time.
query date-time
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 21/181
```
Try it out!
```
GET /public/v{version}/class/classes Get scheduled classes.
```
Model Example Value
Parameter Value Description ParameterType Data Type
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Classes": [
```
{
```
"ClassScheduleId": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.classDescriptionIds Provide
multiple
values in
new lines.
The requested class
description IDs.
query Array[integer]
request.classIds Provide
multiple
values in
new lines.
The requested class IDs. query Array[integer]
request.classScheduleIds Provide
multiple
values in
new lines.
The requested
classSchedule Ids.
query Array[integer]
request.clientId The client ID of the client
who is viewing this class
list. Based on identity, the
query string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 22/181
```
Parameter Value Description ParameterType Data Type
client may be able to see
additional information,
such as membership
specials.
request.endDateTime The requested end date
for filtering. NOTE:
ClassDate does not take
Class Time into
consideration.
```
Default: today’s date
```
query date-time
request.hideCanceledClasses When true , canceled
classes are removed from
the response.
When false , canceled
classes are included in the
response.
```
Default: false
```
query boolean
request.lastModifiedDate When included in the
request, only records
modified on or after the
LastModifiedDate
specified are included in
the response.
query date-time
request.limit Number of results to
include, defaults to 100
query integer
request.locationIds Provide
multiple
values in
new lines.
A list of location IDs on
which to base the search.
query Array[integer]
request.offset Page offset, defaults to 0. query integer
request.programIds Provide
multiple
values in
new lines.
A list of program IDs on
which to base the search.
query Array[integer]
request.schedulingWindow When true , classes
outside scheduling window
are removed from the
response.
When false , classes
are included in the
response, regardless of
the scheduling window.
```
Default: false
```
query boolean
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 23/181
```
Parameter Value Description ParameterType Data Type
request.semesterIds Provide
multiple
values in
new lines.
A list of semester IDs on
which to base the search.
query Array[integer]
request.sessionTypeIds Provide
multiple
values in
new lines.
A list of session type IDs
on which to base the
search.
query Array[integer]
request.staffIds Provide
multiple
values in
new lines.
The requested IDs of the
teaching staff members.
query Array[long]
request.startDateTime The requested start date
for filtering. This also
determines what you will
see for the
‘BookingWindow’
StartDateTime in the
response. For example, if
you pass a StartDateTime
that is on OR before the
BookingWindow ‘Open’
days of the class, you will
retrieve the actual
‘StartDateTime’ for the
Booking Window. If you
pass a StartDateTime that
is after the
BookingWindow ‘date’,
then you will receive
results based on that start
date. NOTE: ClassDate
does not take Class Time
into consideration.
query date-time
request.uniqueClientId The unique ID of the client
who is viewing this class
list. Based on identity, the
client may be able to see
additional information,
such as membership
specials. Note: you need
to provide the
'UniqueClientId' OR the
'ClientId'. If both are
provided, the
'UniqueClientId' takes
precedence.
query long
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 24/181
```
Try it out!
```
GET /public/v{version}/class/classschedules Get class schedules.
```
Model Example Value
Parameter Value Description ParameterType Data Type
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
Get class schedules.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"ClassSchedules": [
```
{
```
"Classes": [
```
{
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.classScheduleIds Provide
multiple
values in
new lines.
The class schedule
IDs.
```
Default: all
```
query Array[integer]
request.endDate The end date of the
range. Return any
active enrollments that
occur on or before this
day.
```
Default: StartDate
```
query date-time
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 25/181
```
Try it out!
```
GET /public/v{version}/class/classvisits Get information about clients booked in a class.
```
Parameter Value Description ParameterType Data Type
request.limit Number of results to
include, defaults to
100
query integer
request.locationIds Provide
multiple
values in
new lines.
The location IDs.
```
Default: all
```
query Array[integer]
request.offset Page offset, defaults to
0.
query integer
request.programIds Provide
multiple
values in
new lines.
The program IDs.
```
Default: all
```
query Array[integer]
request.sessionTypeIds Provide
multiple
values in
new lines.
The session type IDs.
```
Default: all
```
query Array[integer]
request.staffIds Provide
multiple
values in
new lines.
The staff IDs.
```
Default: all
```
query Array[long]
request.startDate The start date of the
range. Return any
active enrollments that
occur on or after this
day.
```
Default: today’s date
```
query date-time
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 26/181
```
Model Example Value
Try it out!
Returns a list of visits that contain information for a specified class. On success, this request returns the class object in the
response with a list of visits.
```
Response Class (Status 200)
```
OK
```
{
```
```
"Class": {
```
"ClassScheduleId": 0,
"Visits": [
```
{
```
"AppointmentId": 0,
"AppointmentGenderPreference": "None",
"AppointmentStatus": "None",
"ClassId": 0,
"ClientId": "string",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.lastModifiedDate When included in the
request, only records
modified on or after the
LastModifiedDate
specified are included in
the response.
query date-time
request.useSiteSettingsStaffName When true , the staff
DisplayName will be
populated based on site-
level settings. When
false or omitted, the
staff DisplayName will
contain only the
FirstName.
query boolean
version 6 version of the api. header string
```
request.classID (required) The class ID. query long
```
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 27/181
```
```
GET /public/v{version}/class/courses Fetch the list of the course for a studio
```
Model Example Value
Implementation Notes
This endpoint will provide all the data related to courses depending on the access level.
```
Note: The Authorization is an optional header.If Authorization header is not passed, the response will be masked else full
```
response will be provided.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Courses": [
```
{
```
"Id": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
getCoursesRequest.courseIDs Provide
multiple
values in
new lines.
Return only courses
that are available for
the specified
CourseIds.
query Array[long]
getCoursesRequest.endDate The end date range.
Any active courses
that are on or before
this day.
```
(optional) Defaults to
```
StartDate.
query date-time
getCoursesRequest.limit Number of results to
include, defaults to
100
query integer
getCoursesRequest.locationIDs Provide
multiple
values in
new lines.
Return only courses
that are available for
the specified
LocationIds.
query Array[integer]
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 28/181
```
Try it out!
```
GET /public/v{version}/class/semesters Fetch the list of the Semesters
```
Model Example Value
Parameter Value Description ParameterType Data Type
getCoursesRequest.offset Page offset, defaults
to 0.
query integer
getCoursesRequest.programIDs Provide
multiple
values in
new lines.
Return only courses
that are available for
the specified
ProgramIds.
query Array[integer]
getCoursesRequest.semesterIDs Provide
multiple
values in
new lines.
Return only courses
that are available for
the specified
SemesterIds.
query Array[integer]
getCoursesRequest.staffIDs Provide
multiple
values in
new lines.
Return only courses
that are available for
the specified StaffIds.
query Array[long]
getCoursesRequest.startDate The start date range.
Any active courses
that are on or after
this day.
```
(optional) Defaults to
```
today.
query date-time
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint retrieves the business class semesters.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 29/181
```
Try it out!
"PageSize": 0,
"TotalResults": 0
```
},
```
"Semesters": [
```
{
```
"Id": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.active When true, the response
only contains semesters
which are activated.
When false, only
deactivated semesters
are returned. Default:
All semesters
query boolean
request.endDate The end date for the
range. All semesters
that are on or before this
day. Default: StartDate
query date-time
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to
0.
query integer
request.semesterIDs Provide
multiple
values in
new lines.
The requested semester
IDs.
query Array[integer]
request.startDate The start date for the
range. All semesters
that are on or after this
day. Default: today’s
date
query date-time
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 30/181
```
```
GET /public/v{version}/class/waitlistentries Get waiting list entries.
```
Model Example Value
Implementation Notes
Returns a list of waiting list entries for a specified class schedule or class. The request requires staff credentials and either a
class schedule ID or class ID.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"WaitlistEntries": [
```
{
```
"ClassDate": "2026-01-12T22:22:46.444Z",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.classIds Provide
multiple
values in
new lines.
The requested class IDs. If
a class ID is present, the
request automatically
disregards any class
schedule IDs in the
request.
Either
ClassScheduleIds ,
ClientIds ,
WaitlistEntryIds , or
```
ClassIds is required; the
```
others become optional.
```
Default: all ClassIds
```
query Array[integer]
request.classScheduleIds Provide
multiple
values in
new lines.
The requested class
schedule IDs. If a class ID
is present, the request
automatically disregards
any class schedule IDs in
the request.
Either
ClassScheduleIds ,
ClientIds ,
WaitlistEntryIds , or
```
ClassIds is required; the
```
query Array[integer]
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 31/181
```
Try it out!
```
POST /public/v{version}/class/addclassschedule
```
This endpoint adds a class schedule. For a single day schedule, the EndDate parameter can be omitted.
Model Example Value
Parameter Value Description ParameterType Data Type
others become optional.
```
Default: all
```
ClassScheduleIds
request.clientIds Provide
multiple
values in
new lines.
The requested client IDs.
Either
ClassScheduleIds ,
ClientIds ,
WaitlistEntryIds , or
```
ClassIds is required; the
```
others become optional.
```
Default: all ClientIds
```
query Array[string]
request.hidePastEntries When true , indicates that
past waiting list entries are
hidden from clients.
When false , indicates
that past entries are not
hidden from clients.
```
Default: false
```
query boolean
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to 0. query integer
request.waitlistEntryIds Provide
multiple
values in
new lines.
The requested waiting list
entry IDs.
Either
ClassScheduleIds ,
ClientIds ,
WaitlistEntryIds , or
```
ClassIds is required; the
```
others become optional.
```
Default: all
```
WaitlistEntryIds
query Array[integer]
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 32/181
```
Model Example Value
Try it out!
```
POST /public/v{version}/class/addclienttoclass Book a client into a class.
```
```
{
```
"ClassId": 0,
"ClassInstanceIds": [
0
]
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClassDescriptionId": 0,
"LocationId": 0,
"StartDate": "2026-01-12T22:22:46.467Z"
"EndDate": "2026-01-12T22:22:46.467Z",
"StartTime": "2026-01-12T22:22:46.467Z"
"EndTime": "2026-01-12T22:22:46.467Z",
"DaySunday": true,
"DayMonday": true,
"DayTuesday": true,
"DayWednesday": true,
"D Th d " t
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint adds a client to a class or to a class waiting list. To prevent overbooking a class or booking outside the schedule
```
windows set forth by the business, it is necessary to first check the capacity level of the class (‘MaxCapacity’ and
```
```
'TotalBooked’) and the 'IsAvailable’ parameter by running the GetClasses REQUEST. It is helpful to use this endpoint in the
```
following situations:
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 33/181
```
Model Example Value
Use after calling GET Clients and GET Classes so that you are sure which client to book in which class.
If adding a client to a class from a waiting list, use this call after you call GET WaitlistEntries and determine the ID of
the waiting list from which you are moving the client.
If adding a client to a class and using a pricing option that the client has already purchased, use this call after you call GET
ClientServices to determine the ID of the pricing option that the client wants to use.
If you add a client to a class and the client purchases a new pricing option, use GET Services , GET Classes , and then
POST CheckoutShoppingCart in place of this call.
This endpoint also supports cross-regional class bookings. If you want to perform a cross-regional class booking, set
CrossRegionalBooking to true . This endpoint does not support adding a user to a waiting list using a cross-regional
```
client pricing option(service). Cross-regional booking workflows do not support client service scheduling restrictions.
```
When performing a cross-regional class booking, this endpoint loops through the first ten sites that the client is associated
with, looks for client pricing options at each of those sites, and then uses the oldest client pricing option found.It is important to
note that this endpoint only loops through a maximum of ten associated client sites. If a ClientID is associated with more
than ten sites in an organization, this endpoint only loops through the first ten.If you know that a client has a client service at
another site, you can specify that site using the CrossRegionalBookingClientServiceSiteId query parameter.
If you perform a cross-regional booking, two additional fields are included in the SessionType object of the response:
SiteID , which specifies where the client service is coming from
CrossRegionalBookingPerformed , a Boolean field that is set to true
As a prerequisite to using this endpoint, your SourceName must have been granted access to the organization to which the
site belongs.
```
Note: Request deduplication is enabled for this endpoint. More information can be found in the Request Deduplication Page.
```
Use the X-RequestDeduplication-Skip header to bypass deduplication if necessary. This may be useful in scenarios
where you want to ensure a new appointment is created regardless of previous identical requests.
```
Response Class (Status 200)
```
OK
```
{
```
```
"Visit": {
```
"AppointmentId": 0,
"AppointmentGenderPreference": "None",
"AppointmentStatus": "None",
"ClassId": 0,
"ClientId": "string",
"StartDateTime": "2026-01-12T22:22:46.469Z",
"EndDateTime": "2026-01-12T22:22:46.469Z",
"Id": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 34/181
```
Model Example Value
Try it out!
```
POST /public/v{version}/class/cancelsingleclass Cancels a single class instance.
```
Model Example Value
Parameter Value Description ParameterType Data Type
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClientId": "string",
"ClassId": 0,
"Test": true,
"RequirePayment": true,
"Waitlist": true,
"SendEmail": true,
"WaitlistEntryId": 0,
"ClientServiceId": 0,
"CrossRegionalBooking": true,
"CrossRegionalBookingClientServiceSiteI
"UniqueId": 0
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint will cancel a single class from studio.
```
Response Class (Status 200)
```
OK
```
{
```
```
"Class": {
```
"ClassScheduleId": 0,
"Visits": [
```
{
```
"AppointmentId": 0,
"AppointmentGenderPreference": "None",
"AppointmentStatus": "None",
"ClassId": 0,
"ClientId": "string",
Response Content Type application/json
Parameters
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 35/181
```
Model Example Value
Try it out!
```
POST /public/v{version}/class/removeclientfromclass Remove a client from a class.
```
Model Example Value
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClassID": 0,
"HideCancel": true,
"SendClientEmail": true,
"SendStaffEmail": true
```
}
```
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"Class": {
```
"ClassScheduleId": 0,
"Visits": [
```
{
```
"AppointmentId": 0,
"AppointmentGenderPreference": "None",
"AppointmentStatus": "None",
"ClassId": 0,
"ClientId": "string",
Response Content Type application/json
Parameters
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 36/181
```
Model Example Value
Try it out!
```
POST /public/v{version}/class/removeclientsfromclasses Remove a clients from a classes.
```
Model Example Value
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClientId": "string",
"UniqueClientId": 0,
"ClassId": 0,
"Test": true,
"SendEmail": true,
"LateCancel": true,
"VisitId": 0
```
}
```
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint can be utilized for removing multiple clients from multiple classes in one request.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Classes": [
```
{
```
"ClassScheduleId": 0,
Response Content Type application/json
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 37/181
```
Model Example Value
Try it out!
```
POST /public/v{version}/class/removefromwaitlist Remove a client from a waiting list.
```
Model Example Value
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"Details": [
```
{
```
"ClientIds": [
"string"
],
"ClassId": 0
```
}
```
],
"Test": true,
"SendEmail": true,
"LateCancel": true
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint does not return a response. If a call to this endpoint results in a 200 OK HTTP status code, then the call was
successful.
```
Response Class (Status 200)
```
OK
```
{}
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 38/181
```
Try it out!
```
POST /public/v{version}/class/substituteclassteacher Substitute a class teacher.
```
Model Example Value
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
request.waitlistEntryIds Provide
multiple
values in
new lines
```
(at least
```
one
```
required).
```
A list of
WaitlistEntryIds to
remove from the waiting
list.
query Array[integer]
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"Class": {
```
"ClassScheduleId": 0,
```
"Location": {
```
"AdditionalImageURLs": [
"string"
],
"Address": "string",
"Address2": "string",
"Amenities": [
```
{
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 39/181
```
Model Example Value
Try it out!
```
POST /public/v{version}/class/updateclassschedule This endpoint updates a class schedule.
```
Model Example Value
Parameter Value Description ParameterType Data Type
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClassId": 0,
"StaffId": 0,
"OverrideConflicts": true,
"SendClientEmail": true,
"SendOriginalTeacherEmail": true,
"SendSubstituteTeacherEmail": true
```
}
```
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint updates a class schedule.
```
Response Class (Status 200)
```
OK
```
{
```
"ClassId": 0,
"ClassInstanceIds": [
0
]
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 40/181
```
Model Example Value
Try it out!
```
PATCH /public/v{version}/class/updateclassschedulenotes/{classScheduleId}
```
This endpoint updates a class schedule notes.
Model Example Value
Parameter Value Description ParameterType Data Type
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClassId": 0,
"ClassDescriptionId": 0,
"LocationId": 0,
"StartDate": "2026-01-12T22:22:46.512Z"
"EndDate": "2026-01-12T22:22:46.512Z",
"StartTime": "2026-01-12T22:22:46.512Z"
"EndTime": "2026-01-12T22:22:46.512Z",
"DaySunday": true,
"DayMonday": true,
"DayTuesday": true,
"DayWednesday": true
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint updates the notes of class instances based on the schedule's schedule ID. Note: Every coming class instance
for the given ScheduleID will have the notes updated the same way.
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
classScheduleId (required) path integer
```
```
request (required) body
```
```
{
```
"Notes": "string"
```
}
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 41/181
```
Try it out!
Client
```
GET /public/v{version}/client/activeclientmemberships Get a client's active memberships.
```
Model Example Value
Parameter Value Description ParameterType Data Type
Parameter content type:
application/json
siteId -99 ID of the site
from which
to pull data.
header string
```
version (required) path string
```
Response Messages
HTTP Status Code Reason Response Model Headers
204 No Content
Implementation Notes
Please note that client memberships with location restrictions can only be used to pay for scheduled services at the site to
which they belong. Memberships with location restrictions can not be used to pay for scheduled services at other sites within
an organization.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"ClientMemberships": [
```
{
```
"RestrictedLocations": [
```
{
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterTypeDataType
authorization A staff user authorization token. header string
request.clientAssociatedSitesOffset Used to retrieve a client’s memberships from
multiple sites within an organization when the
query integer
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 42/181
```
Parameter Value Description ParameterTypeDataType
client is associated with more than ten sites.
To change which ten sites are searched,
change this offset value. A value of 0 means
that no sites are skipped and the first ten sites
are returned. You can use the
CrossRegionalClientAssociations
value from GET
CrossRegionalClientAssociations to
determine how many sites the client is
associated with. Note that you must always
have CrossRegionalLookup set to true
to use this parameter.
```
Default: 0
```
For example, if a client is associated with 25
sites, you need to call GET
ActiveClientMemberships three times,
as follows:
Use GET
CrossRegionalClientAssociations
to determine how many sites a client is
associated with, which tells you how many
additional calls you need to make.
Either omit
ClientAssociatedSitesOffset or
set it to 0 to return the client’s
memberships from sites 1-10
Set ClientAssociatedSitesOffset
to 10 to return the client’s memberships
from sites 11-20
Set ClientAssociatedSitesOffset
to 20 to return the client’s memberships
from sites 21-25
request.crossRegionalLookup Used to retrieve a client’s memberships from
multiple sites within an organization. When
included and set to true , it searches a
maximum of ten sites with which this client is
associated. When a client is associated with
more than ten sites, use
ClientAssociatedSitesOffset as
many times as needed to search the
additional sites with which the client is
associated. You can use the
CrossRegionalClientAssociations
value from GET
CrossRegionalClientAssociations to
determine how many sites the client is
associated with. Note that a SiteID is
returned and populated in the
ClientServices response when
CrossRegionalLookup is set to true .
```
Default: false
```
query boolean
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 43/181
```
Try it out!
```
GET /public/v{version}/client/activeclientsmemberships Get a client's active memberships.
```
Model Example Value
Parameter Value Description ParameterTypeDataType
request.limit Number of results to include, defaults to 100 query integer
request.locationId Filters results to memberships that can be
used to pay for scheduled services at that
location. This parameter can not be passed
when CrossRegionalLookup is true .
query integer
request.offset Page offset, defaults to 0. query integer
request.uniqueClientId The Unique ID of the client for whom
memberships are returned. Note that
UniqueClientId takes precedence over
ClientId if both are provided.
query long
version 6 version of the api. header string
```
request.clientId (required) The ID of the client for whom memberships
```
are returned.
query string
siteId -99 ID of the site from which to pull data. header string
```
version (required) path string
```
Implementation Notes
The endpoint returns a list of memberships for multiple clients we pass in query parameter. Please note that clients
memberships with location restrictions can only be used to pay for scheduled services at the site to which they belong.
Memberships with location restrictions can not be used to pay for scheduled services at other sites within an organization.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"ClientMemberships": [
```
{
```
"ClientId": "string",
Response Content Type application/json
Parameters
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 44/181
```
Parameter Value Description ParameterType Data Type
authorization A staff user authorization token. header string
request.clientAssociatedSitesOffset Used to retrieve a client’s memberships from
multiple sites within an organization when the
client is associated with more than ten sites.
To change which ten sites are searched,
change this offset value. A value of 0 means
that no sites are skipped and the first ten
sites are returned. You can use the
CrossRegionalClientAssociations
value from GET
CrossRegionalClientAssociations to
determine how many sites the client is
associated with. Note that you must always
have CrossRegionalLookup set to true
to use this parameter.
```
Default: 0
```
For example, if a client is associated with 25
sites, you need to call
GetClientServices three times, as
```
follows:
```
Use GET
CrossRegionalClientAssociations
to determine how many sites a client is
associated with, which tells you how many
additional calls you need to make.
Either omit
ClientAssociatedSitesOffset or
set it to 0 to return the client’s services
```
(pricing options) from sites 1-10.
```
Set ClientAssociatedSitesOffset
to 10 to return the client pricing options
from sites 11-20
Set ClientAssociatedSitesOffset
to 20 to return the client pricing options
from sites 21-25
query integer
request.crossRegionalLookup Used to retrieve a client’s memberships from
multiple sites within an organization. When
included and set to true , it searches a
maximum of ten sites with which this client is
associated. When a client is associated with
more than ten sites, use
ClientAssociatedSitesOffset as
many times as needed to search the
additional sites with which the client is
associated. You can use the
CrossRegionalClientAssociations
value from GET
CrossRegionalClientAssociations to
determine how many sites the client is
associated with. Note that a SiteID is
returned and populated in the
ClientServices response when
query boolean
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 45/181
```
Try it out!
```
GET /public/v{version}/client/clientaccountbalances Get account balance information for one or more client(s).
```
Model Example Value
Parameter Value Description ParameterType Data Type
CrossRegionalLookup is set to true .
```
Default: false
```
request.limit Number of results to include, defaults to 100 query integer
request.locationId Filters results to memberships that can be
used to pay for scheduled services at that
location. This parameter can not be passed
when CrossRegionalLookup is true .
query integer
request.offset Page offset, defaults to 0. query integer
version 6 version of the api. header string
request.clientIds Provide
multiple
values in
new lines
```
(at least
```
one
```
required).
```
The ID of the client for whom
memberships are returned. Maximum
```
allowed : 200.
```
query Array[strin
siteId -99 ID of the site from which to pull data. header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Clients": [
```
{
```
"AppointmentGenderPreference": "None",
Response Content Type application/json
Parameters
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 46/181
```
Try it out!
```
GET /public/v{version}/client/clientcompleteinfo
```
Get Services, Contracts, MemberShips and Arrivals for Client as per requirement
Model Example Value
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.balanceDate The date you want a
balance relative to.
```
Default: the current
```
date
query date-time
request.classId The class ID of the
event for which you want
a balance.
query integer
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to
0.
query integer
version 6 version of the api. header string
request.clientIds Provide
multiple
values in
new lines
```
(at least
```
one
```
required).
```
The list of clients IDs
for which you want
account balances.
query Array[string]
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint returns complete client information along with list of purchased services, contract details, membership details
and arrival programs for a specific client.
```
Response Class (Status 200)
```
OK
```
{
```
```
"Client": {
```
```
"SuspensionInfo": {
```
"BookingSuspended": true,
"SuspensionStartDate": "string",
"SuspensionEndDate": "string"
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 47/181
```
```
},
```
"AppointmentGenderPreference": "None",
"BirthDate": "2026-01-12T22:22:46.529Z",
"Country": "string",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization token. header string
consumer-identity-token A consumers authorization token to replace
the need of clientId in the request.
header string
request.clientAssociatedSitesOffset Used to retrieve a client’s pricing options from
multiple sites within an organization when the
client is associated with more than ten sites.
To change which ten sites are searched,
change this offset value. A value of 0 means
that no sites are skipped and the first ten
sites are returned. You can use the
CrossRegionalClientAssociations
value from GET
CrossRegionalClientAssociations to
determine how many sites the client is
associated with. Note that you must always
have CrossRegionalLookup set to true
to use this parameter.
```
Default: 0
```
For example, if a client is associated with 25
sites, you need to call
GetClientServices three times, as
```
follows:
```
Use GET
CrossRegionalClientAssociations
to determine how many sites a client is
associated with, which tells you how many
additional calls you need to make.
Either omit
ClientAssociatedSitesOffset or
set it to 0 to return the client’s services
```
(pricing options) from sites 1-10.
```
Set ClientAssociatedSitesOffset
to 10 to return the client pricing options
from sites 11-20
Set ClientAssociatedSitesOffset
to 20 to return the client pricing options
from sites 21-25
query integer
request.crossRegionalLookup Used to retrieve a clients pricing options from
multiple sites within an organization.When
included and set to true , it searches a
maximum of ten sites with which this client is
associated.When a client is associated with
query boolean
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 48/181
```
Parameter Value Description ParameterType Data Type
more than ten sites, use
ClientAssociatedSitesOffset as
many times as needed to search the
additional sites with which the client is
associated. You can use the
CrossRegionalClientAssociations
value from GET
CrossRegionalClientAssociations to
determine how many sites the client is
associated with. Note that a SiteID is
returned and populated in the
ClientServices response when
CrossRegionalLookup is set to true .
```
Default: false
```
request.endDate Filters results to pricing options that are
purchased on or before this date. Default:
today’s date.
query date-time
request.excludeInactiveSites When this flag is set to true , will exclude
inactive sites from the response Default:
false
query boolean
request.requiredClientData Provide
multiple
values in
new lines.
Used to retrieve list of purchased services,
contract details, membership details and
arrival programs for a specific client. Default
ClientServices , ClientContracts ,
ClientMemberships and
ClientArrivals will be returned when
RequiredClientDatais not set. When
RequiredClientData is set to
Contracts then only ClientContracts
will be returned in the response. When
RequiredClientData is set to Services
then only ClientServices will be
returned in the response. When
RequiredClientData is set to
Memberships then only
ClientMemberships will be returned in
the response. When
RequiredClientData is set to
ArrivalPrograms then only
ClientArrivals will be returned in the
response.
query Array[strin
request.showActiveOnly When true , includes active services only.
Set this field to true when trying to
determine if a client has a service that can
pay for a class or appointment. Default: false
query boolean
request.startDate Filters results to pricing options that are
purchased on or after this date. Default:
today’s date.
query date-time
request.uniqueClientId The unique ID of the client who is viewing this query long
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 49/181
```
Try it out!
```
GET /public/v{version}/client/clientcontracts Get contracts that a client has purchased.
```
Model Example Value
Parameter Value Description ParameterType Data Type
class list.
request.useActivateDate When this flag is set to true , the date
filtering will use activate date to filter the
pricing options. When this flag is set to
false , the date filtering will use purchase
date to filter the pricing options. Default: false
query boolean
version 6 version of the api. header string
```
request.clientId (required) Filters results to client with these ID. query string
```
siteId -99 ID of the site from which to pull data. header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Contracts": [
```
{
```
"PayerClientId": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.clientAssociatedSitesOffset Determines how many sites
are skipped over when
retrieving a client’s cross
regional contracts. Used
when a client ID is linked to
more than ten sites in an
organization. Only a
maximum of ten site
query integer
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 50/181
```
Try it out!
```
DELETE /public/v{version}/client/clientdirectdebitinfo Delete direct debit info for a client.
```
Model Example Value
Parameter Value Description ParameterType Data Type
databases are queried when
this call is made and
CrossRegionalLookup
is set to true . To change
which sites are queried,
change this offset value.
```
Default: 0
```
request.crossRegionalLookup When true , indicates that
the requesting client’s cross
regional contracts are
returned, if any.
When false , indicates
that cross regional contracts
are not returned.
query boolean
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to 0. query integer
request.uniqueClientId The unique ID of the
requested client.
query long
version 6 version of the api. header string
```
request.clientId (required) The ID of the client
```
```
(RssId).
```
query string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint deletes direct debit info from a client’s account. This endpoint requires staff user credentials.
```
Response Class (Status 200)
```
This endpoint does not return a response. If a call to this endpoint results in a 200 OK HTTP status code, then the call was
successful.
```
{}
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 51/181
```
Try it out!
```
GET /public/v{version}/client/clientdirectdebitinfo Get direct debit info for a client.
```
Model Example Value
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
clientId The ID of the client. query string
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint returns direct debit info stored on a client's account. This endpoint requires staff user credentials.
A null response from this endpoint indicates that the client has no usable direct debit information on their account.Use the
POST AddClientDirectDebitInfo endpoint to add direct debit information to a client’s account.
```
Response Class (Status 200)
```
OK
```
{
```
"NameOnAccount": "string",
"RoutingNumber": "string",
"AccountNumber": "string",
"AccountType": "string"
```
}
```
Response Content Type application/json
Parameters
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 52/181
```
Try it out!
```
GET /public/v{version}/client/clientduplicates
```
Get client records that would be considered duplicates of the client values passed in.
Model Example Value
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
clientId The ID of the client. query string
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint gets client records that would be considered duplicates based on case-insensitive matching of the client's first
name, last name, and email. For there to be results, all three parameters must match a client record. This endpoint requires
staff user credentials.
An empty ClientDuplicates object in the response from this endpoint indicates that there were no client records found
that match the first name, last name, and email fields passed in.
If one client record is returned, it is not a duplicate itself, but no other client record can be created or updated that would
match this client's first name, last name, and email combination.
If more than one client record is returned, these clients are duplicates of each other.We recommend discussing with the
business how they would like to resolve duplicate records in the event the response contains more than one client
record.Businesses can use the Merge Duplicate Clients tool in the Core Business Mode software to resolve the duplicate
client records.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"ClientDuplicates": [
```
{
```
"Id": "string",
Response Content Type application/json
Parameters
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 53/181
```
Try it out!
```
GET /public/v{version}/client/clientformulanotes Get a client's formula notes.
```
Model Example Value
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.email The client email to match
on when searching for
duplicates.
query string
request.firstName The client first name to
match on when searching
for duplicates.
query string
request.lastName The client last name to
match on when searching
for duplicates.
query string
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to 0. query integer
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
```
QueryParams: Enables to retrieve cross regional formula notes for a client, or for a specific appointment. The two parameters
```
are optional, however at least one must be provided. This endpoint supports pagination.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"FormulaNotes": [
```
{
```
"Id": 0,
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 54/181
```
Try it out!
```
GET /public/v{version}/client/clientindexes Get a site's configured client indexes and client index values.
```
Model Example Value
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.appointmentId The appointment ID of
an appointment in the
studio specified in the
header of the request.
query long
request.clientId The client ID of the
client whose formula
notes are being
requested.
query string
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to
0.
query integer
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
Client indexes are used to analyze client demographics. A business owner can set up different categories with sets of values
which they can assign to each client. Client indexes are used in client searches, for tagging clients so that the owner can send
mass emails to similar groups, and for many reports.
```
For more information, see Client Indexes and Client Index Values (video tutorial).
```
```
Response Class (Status 200)
```
OK
```
{
```
"ClientIndexes": [
```
{
```
"Id": 0,
"Name": "string",
"RequiredBusinessMode": true,
"RequiredConsumerMode": true,
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 55/181
```
Try it out!
```
GET /public/v{version}/client/clientpurchases Get a client's purchase history.
```
Model Example Value
"Values": [
```
{
```
"Active": true
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.requiredOnly When true , filters the
results to only indexes
that are required on
creation.
When false or
omitted, returns all of the
client indexes.
query boolean
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
Gets a list of purchases made by a specific client.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Purchases": [
```
{
```
```
"Sale": {
```
Response Content Type application/json
Parameters
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 56/181
```
Try it out!
```
GET /public/v{version}/client/clientreferraltypes Get a site's configured client referral types.
```
Model Example Value
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.endDate Filters results to
purchases made before
this timestamp.
```
Default: end of today
```
query date-time
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to
0.
query integer
request.saleId Filters results to the
single record associated
with this ID.
query integer
request.startDate Filters results to
purchases made on or
after this timestamp.
```
Default: now
```
query date-time
request.uniqueClientId The unique ID of the
requested client.
query long
version 6 version of the api. header string
```
request.clientId (required) The ID of the client
```
you are querying for
purchases.
query string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
Gets a list of referral types. Referral types are options that new clients can choose to identify how they learned about the
business. Referral types are typically used for the sign-up process.
```
Response Class (Status 200)
```
OK
```
{
```
"ReferralTypes": [
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 57/181
```
Try it out!
```
GET /public/v{version}/client/clientrewards Gets the client rewards.
```
Model Example Value
"string"
]
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.includeInactive When true , filters the
results to include
subtypes and inactive
referral types.
When false , includes
no subtypes and only
active types.
```
Default:false
```
query boolean
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Balance": 0,
"Transactions": [
```
{
```
Response Content Type application/json
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 58/181
```
Try it out!
```
POST /public/v{version}/client/clientrewards Update Client Reward
```
Model Example Value
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.endDate The end date of
transaction. Default:
StartDate
query date-time
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to 0. query integer
request.startDate The start date of
transaction. Default:
today
query date-time
version 6 version of the api. header string
```
request.clientId (required) The ID of the client. query string
```
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
Earns or redeems rewards points for a given client, based on site settings. Cross regional rewards are not supported at this
time.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Balance": 0,
"Transactions": [
```
{
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 59/181
```
Model Example Value
Try it out!
```
GET /public/v{version}/client/clients
```
This endpoint requires staff user credentials. This endpoint supports pagination. See Pagination for a description of the Pagination
information.
Model Example Value
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClientId": "string",
"Points": 0,
"Source": "string",
"SourceId": 0,
"Action": "string",
"ActionDateTime": "2026-01-12T22:22:46
```
}
```
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Clients": [
```
{
```
```
"SuspensionInfo": {
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 60/181
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.clientIDs Provide
multiple
values in
new lines.
The requested client
IDs. Default: all IDs that
the authenticated user’s
access level allows.
```
Note: You can fetch
```
information for
maximum 20 clients at
once.
query Array[string]
request.includeInactive When true , indicates
the results to include
active and inactive
clients.
When false ,
indicates that only
those clients who are
marked as active
should be returned.
```
Default: false
```
query boolean
request.isProspect When true , filters the
results to include only
those clients marked as
prospects for the
business.
When false ,
indicates that only
those clients who are
not marked prospects
should be returned.
query boolean
request.lastModifiedDate Filters the results to
include only the clients
that have been modified
on or after this date.
query date-time
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to
0.
query integer
request.searchText Text to use in the
search. Can include
FirstName, LastName,
and Email. Note that
user credentials must
be provided.
query string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 61/181
```
Try it out!
```
GET /public/v{version}/client/clientschedule Gets a client's schedule history.
```
Model Example Value
Parameter Value Description ParameterType Data Type
request.uniqueIds Provide
multiple
values in
new lines.
Filters results to clients
with these
UniqueIDs . This
parameter cannot be
used with ClientIDs
or SearchText .
```
Default: all UniqueIDs
```
that the authenticated
user’s access level
allows.
query Array[long]
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint can be utilized to retrieve scheduled visits which is associated with the requested client.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Visits": [
```
{
```
```
"WaitlistInfo": {
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.clientAssociatedSitesOffset The number of sites
to skip when
returning the site
query integer
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 62/181
```
Parameter Value Description ParameterType Data Type
associated with a
client.
request.clientId The ID of the
requested client.
query string
request.crossRegionalLookup When true ,
indicates that past
and scheduled client
visits across all sites
in the region are
returned. When
false , indicates
that only visits at the
current site are
returned.
query boolean
request.endDate The date past which
class visits are not
returned. Default is
today’s date
query date-time
request.includeWaitlistEntries When true , waitlist
entries are included
in the response.
When false ,
waitlist entries are
removed from the
response. Default:
false
query boolean
request.limit Number of results to
include, defaults to
100
query integer
request.offset Page offset, defaults
to 0.
query integer
request.startDate The date before
which class visits are
not returned. Default
is the end date
query date-time
request.uniqueClientId The unique ID of the
requested client.
```
Note: you need to
```
provide the
'UniqueClientId' OR
the 'ClientId'. If both
are provided, the
'UniqueClientId' takes
precedence.
query long
version 6 version of the api. header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 63/181
```
Try it out!
```
GET /public/v{version}/client/clientservices Get pricing options that a client has purchased.
```
Model Example Value
Parameter Value Description ParameterType Data Type
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"ClientServices": [
```
{
```
"ActivationType": "OnFirstVisit",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Typ
authorization A staff user authorization token. header string
request.classId Filters results to only those pricing options
that can be used to pay for this class.
query integer
request.classScheduleID Provide
multiple
values in
new lines.
Filters results to pricing options which are
associated with one of the ClassScheduleIDs
query Array[inte
request.clientAssociatedSitesOffset Used to retrieve a client’s pricing options from
multiple sites within an organization when the
client is associated with more than ten sites.
To change which ten sites are searched,
change this offset value. A value of 0 means
that no sites are skipped and the first ten
sites are returned. You can use the
CrossRegionalClientAssociations
value from GET
CrossRegionalClientAssociations to
determine how many sites the client is
query integer
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 64/181
```
Parameter Value Description ParameterType Data Typ
associated with. Note that you must always
have CrossRegionalLookup set to true
to use this parameter.
```
Default: 0
```
For example, if a client is associated with 25
sites, you need to call
GetClientServices three times, as
```
follows:
```
Use GET
CrossRegionalClientAssociations
to determine how many sites a client is
associated with, which tells you how many
additional calls you need to make.
Either omit
ClientAssociatedSitesOffset or
set it to 0 to return the client’s services
```
(pricing options) from sites 1-10.
```
Set ClientAssociatedSitesOffset
to 10 to return the client pricing options
from sites 11-20
Set ClientAssociatedSitesOffset
to 20 to return the client pricing options
from sites 21-25
request.clientId The ID of the client to query. The results are a
list of pricing options that the client has
purchased. Note that “service” and “pricing
option” are synonymous in this section of the
documentation.
query string
request.clientIds Provide
multiple
values in
new lines.
The IDs of the clients to query. The results
are a list of pricing options that the clients
have purchased. ClientId parameter takes
priority over ClientIds due to backward
compatibility. So if you want to use ClientIds,
then ClientId needs to be empty. Either of
ClientId or ClientIds need to be specified
query Array[stri
request.crossRegionalLookup Used to retrieve a client’s pricing options from
multiple sites within an organization. When
included and set to true , it searches a
maximum of ten sites with which this client is
associated. When a client is associated with
more than ten sites, use
ClientAssociatedSitesOffset as
many times as needed to search the
additional sites with which the client is
associated. You can use the
CrossRegionalClientAssociations
value from GET
CrossRegionalClientAssociations to
determine how many sites the client is
associated with. Note that a SiteID is
returned and populated in the
query boolean
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 65/181
```
Parameter Value Description ParameterType Data Typ
ClientServices response when
CrossRegionalLookup is set to true .
```
Default: false
```
request.endDate Filters results to pricing options that are
purchased on or before this date. Default:
today’s date
query date-time
request.excludeInactiveSites When this flag is set to true , will exclude
inactive sites from the response. Default:
false
query boolean
request.ignoreCrossRegionalSiteLimit Used to specify if the number of cross
regional sites used to search for client’s
pricing options should be ignored. Default:
false
query boolean
request.limit Number of results to include, defaults to 100 query integer
request.locationIds Provide
multiple
values in
new lines.
Filters results to pricing options that can be
used at the listed location IDs.
query Array[inte
request.offset Page offset, defaults to 0. query integer
request.programIds Provide
multiple
values in
new lines.
Filters results to pricing options that belong to
one of the given program IDs.
query Array[inte
request.sessionTypeId Filters results to pricing options that will pay
for the given session type ID. Use this to find
pricing options that will pay for a specific
appointment type.
query integer
request.showActiveOnly When true , includes active services only.
```
Default: false
```
query boolean
request.startDate Filters results to pricing options that are
purchased on or after this date. Default:
today’s date
query date-time
request.uniqueClientId The unique ID of the client to query. Note that
UniqueClientId takes precedence over
ClientId.
query long
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 66/181
```
Try it out!
```
GET /public/v{version}/client/clientvisits Get a client's visit history.
```
Model Example Value
Parameter Value Description ParameterType Data Typ
request.uniqueClientIds Provide
multiple
values in
new lines.
The Unique IDs of the clients to query. Note
that UniqueClientIds collection takes
precedence over ClientIds collection.
query Array[lon
request.useActivateDate When this flag is set to true , the date
filtering will use activate date to filter the
pricing options. When this flag is set to
false , the date filtering will use purchase
date to filter the pricing options. Default: false
query boolean
request.visitCount A filter on the minimum number of visits a
service can pay for.
query integer
version 6 version of the api. header string
siteId -99 ID of the site from which to pull data. header string
```
version (required) path string
```
Implementation Notes
Gets the Client Visits for a specific client.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Visits": [
```
{
```
"AppointmentId": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 67/181
```
Parameter Value Description ParameterType Data Type
authorization token.
request.clientAssociatedSitesOffset The number of sites
to skip when
returning the site
associated with a
client.
query integer
request.clientId The ID of the
requested client.
query string
request.crossRegionalLookup When true ,
indicates that past
and scheduled client
visits across all sites
in the region are
returned.
When false ,
indicates that only
visits at the current
site are returned.
query boolean
request.endDate The date past which
class visits are not
returned. Default:
today's date
query date-time
request.limit Number of results to
include, defaults to
100
query integer
request.offset Page offset, defaults
to 0.
query integer
request.order The sort order for the
results.
When desc , results
are returned in
descending order
```
(newest first).
```
When asc , results
are returned in
ascending order
```
(oldest first).
```
query string
request.startDate The date before
which class visits are
not returned. Default:
the end date
query date-time
request.uniqueClientId The unique ID of the
requested client.
```
Note: you need to
```
provide the
'UniqueClientId' OR
query long
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 68/181
```
Try it out!
```
GET /public/v{version}/client/contactlogs Get contact logs on a client's account.
```
Model Example Value
Parameter Value Description ParameterType Data Type
the 'ClientId'. If both
are provided, the
'UniqueClientId' takes
precedence.
request.unpaidsOnly When true ,
indicates that only
visits that have not
been paid for are
returned.
When false ,
indicates that all
visits are returned,
regardless of whether
they have been paid
for.
```
Default: false
```
query boolean
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint contains a variety of filters that can return not just all contact logs, but also system-generated contact logs,
contact logs assigned to specific staff members, and contact logs of specific types or subtypes.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"ContactLogs": [
```
{
```
"Id": 0,
Response Content Type application/json
Parameters
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 69/181
```
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.endDate Filters the results to
contact logs created
before this date.
```
Default: the start
```
date
query date-time
request.limit Number of results to
include, defaults to
100
query integer
request.offset Page offset, defaults
to 0.
query integer
request.showSystemGenerated When true ,
system-generated
contact logs are
returned in the
results.
```
Default: false
```
query boolean
request.staffIds Provide
multiple
values in
new lines.
Filters the results to
return contact logs
assigned to one or
more staff IDs.
query Array[long]
request.startDate Filters the results to
contact logs created
on or after this date.
```
Default: the current
```
date
query date-time
request.subtypeIds Provide
multiple
values in
new lines.
Filters the results to
contact logs assigned
one or more of these
subtype IDs.
query Array[integer]
request.typeIds Provide
multiple
values in
new lines.
Filters the results to
contact logs assigned
one or more of these
type IDs.
query Array[integer]
version 6 version of the api. header string
```
request.clientId (required) The ID of the client
```
whose contact logs
are being requested.
query string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 70/181
```
Try it out!
```
GET /public/v{version}/client/contactlogtypes Get All Active Contact Log Types
```
Model Example Value
Parameter Value Description ParameterType Data Type
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint contains a variety of filters that can return not just all contact logs, but also system-generated contact logs,
contact logs assigned to specific staff members, and contact logs of specific types or subtypes.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"ContactLogTypes": [
```
{
```
"Id": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.contactLogTypeId The requested
ContactLogType ID.
```
Default: all IDs that the
```
authenticated user’s
access level allows.
query integer
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to
0.
query integer
version 6 version of the api. header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 71/181
```
Try it out!
```
GET /public/v{version}/client/crossregionalclientassociations Get a client's cross regional site associations.
```
Model Example Value
Parameter Value Description ParameterType Data Type
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
```
Returns a list of sites that a particular client ID (also referred to as an RSSID) or a client email address is associated with in a
```
cross-regional organization. Either the ClientID or Email parameter is required. If both are provided, the ClientID is
used.
Use this endpoint to retrieve information for other Public API endpoints, about the same client at multiple sites within an
organization. To use this endpoint, your developer account must have been granted permission to the site's entire
organization.
Note that this endpoint does not work on the Developer Sandbox site, as it is not set up for cross-regional use cases.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"CrossRegionalClientAssociations": [
```
{
```
"SiteId": 0,
"Cli d" " i "
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.clientId Looks up the cross
regional associations
by the client’s ID.
query string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 72/181
```
Parameter Value Description ParameterType Data Type
request.email Looks up the cross
regional associations
by the client’s email
address.
query string
request.excludeInactiveSites Used to exclude
inactive and deleted
sites from the results.
When this flag is set to
true , client profiles
associated with inactive
and deleted sites are
not getting returned.
When this flag is set to
false ,client profiles
associated with inactive
and deleted sites are
getting returned.
```
Default: true
```
query boolean
```
request.firstName First name (used for
```
```
email queries)
```
query string
```
request.lastName Last name (used for
```
```
email queries)
```
query string
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to
0.
query integer
request.uniqueClientId Looks up the cross
regional associations
by the unique client’s
ID. Note: you need to
provide the
'UniqueClientId' OR the
'ClientId' OR the
'Email'. 'UniqueClientId'
takes precedence
when provided. If not,
but both 'ClientId' and
'Email' are provided,
'ClientId' is used by
default.
query long
request.v2 Use newer method query boolean
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 73/181
```
Try it out!
```
GET /public/v{version}/client/customclientfields Get a site's configured custom client fields.
```
Model Example Value
Try it out!
```
GET /public/v{version}/client/requiredclientfields Get client required fields for a site.
```
Parameter Value Description ParameterType Data Type
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"CustomClientFields": [
```
{
```
"Id": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to 0. query integer
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
Gets the list of fields that a new client has to fill out in business mode, specifically for the sign-up process. AddClient and
UpdateClient validate against these fields.
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 74/181
```
Model Example Value
Try it out!
```
POST /public/v{version}/client/addarrival Add an arrival for a client.
```
Model Example Value
This endpoint has no query parameters.
```
Response Class (Status 200)
```
OK
```
{
```
"RequiredClientFields": [
"string"
]
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
Marks a client as arrived for a specified location. A staff user token must be included with staff assigned the
LaunchSignInScreen permission.
When used on a site that is part of a region, the following additional logic will apply:
When a client exists within the region but not at the studio where the arrival is being logged, a local client record will be
automatically created.
If the local client does not have an applicable local membership or pricing option, a membership or pricing option will be
automatically used if it exists elsewhere within the region.
```
Response Class (Status 200)
```
OK
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 75/181
```
Model Example Value
Try it out!
```
POST /public/v{version}/client/addclient Add a client to a site.
```
```
{
```
"ArrivalAdded": true,
```
"ClientService": {
```
"ActiveDate": "2026-01-12T22:22:46.582Z",
"Count": 0,
"Current": true,
"ExpirationDate": "2026-01-12T22:22:46.582Z",
"Id": 0,
"ProductId": 0,
"Name": "string",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClientId": "string",
"LocationId": 0,
"ArrivalTypeId": 0,
"LeadChannelId": 0,
"Test": true
```
}
```
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
Starting the week of May 11th, 2020 all versions of the Public API will no longer allow duplicate clients to be created. This
applies to both adding a client and updating a client record. A duplicate client is created when two profiles have the same first
name, last name and email.
Creates a new client record at the specified business.Passing a User Token as Authorization will create a client and respect
Business Mode required fields.Omitting the token will create a client and respect Consumer Mode required fi elds. To make
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 76/181
```
Model Example Value
Model Example
Try it out!
```
POST /public/v{version}/client/addclientdirectdebitinfo Add client Direct debit info.
```
sure you are collecting all required pieces of information, first run GetRequired ClientFields.
If you have purchased an Ultimate tier then this endpoint will automatically start showing new opportunity on Sales Pipeline.
```
Response Class (Status 200)
```
OK
```
{
```
```
"Client": {
```
"AppointmentGenderPreference": "None",
"BirthDate": "2026-01-12T22:22:46.583Z",
"Country": "string",
"CreationDate": "2026-01-12T22:22:46.583Z",
"CustomClientFields": [
```
{
```
"Value": "string",
"Id": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization token. header string
version 6 version of the api. header string
```
request (required)
```
Parameter content type:
application/json
The FirstName and LastName
parameters are always required in this
request. All other parameters are
optional, but note that any of the optional
parameters could be required by a
particular business, depending on how
the business has configured the site
settings. If GetRequiredClientFields
returns EmergContact in the list of
required fields, then all emergency
contact parameters are required, which
includes
EmergencyContactInfoEmail ,
EmergencyContactInfoName ,
EmergencyContactInfoPhone , and
EmergencyContactInfoRelationship .
body
```
{
```
"AccountBal
"Action": "
"Active": t
"AddressLin
"AddressLin
"ApptGender
"BirthDate"
"City": "st
"ClientCred
"Address"
"CardHold
siteId -99 ID of the site from which to pull data. header string
```
version (required) path string
```
Implementation Notes
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 77/181
```
Model Example Value
Model Example Value
Try it out!
```
POST /public/v{version}/client/addclientformulanote Add client's formula note
```
This endpoint adds direct debit info to a client’s account. This endpoint requires staff user credentials.
```
Response Class (Status 200)
```
OK
```
{
```
"ClientId": "string",
"NameOnAccount": "string",
"RoutingNumber": "string",
"AccountNumber": "string",
"AccountType": "string"
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"Test": true,
"ClientId": "string",
"NameOnAccount": "string",
"RoutingNumber": "string",
"AccountNumber": "string",
"AccountType": "string"
```
}
```
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 78/181
```
Model Example Value
Model Example Value
Try it out!
Implementation Notes
This endpoint adds a formula note for a specified client or specified client appointment. A staff user token must be included
with staff assigned permission to view client profile or have both ViewAppointmentDetails and ModifyAppointment
permissions.
```
Response Class (Status 200)
```
OK
```
{
```
"Id": 0,
"ClientId": "string",
"AppointmentId": 0,
"EntryDate": "2026-01-12T22:22:46.593Z",
"Note": "string",
"SiteId": 0,
"SiteName": "string",
"StaffFirstName": "string",
"StaffLastName": "string",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClientId": "string",
"AppointmentId": 0,
"Note": "string"
```
}
```
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 79/181
```
```
POST /public/v{version}/client/addcontactlog Add a contact log to a client's account.
```
Model Example Value
Model Example Value
Try it out!
```
POST /public/v{version}/client/mergeclients This endpoint helps to merge clients.
```
```
Response Class (Status 200)
```
OK
```
{
```
"Id": 0,
"Text": "string",
"CreatedDateTime": "2026-01-12T22:22:46.594Z",
"FollowupByDate": "2026-01-12T22:22:46.594Z",
"ContactMethod": "string",
"ContactName": "string",
```
"Client": {
```
"AppointmentGenderPreference": "None",
"BirthDate": "2026-01-12T22:22:46.594Z",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClientId": "string",
"AssignedToStaffId": 0,
"Text": "string",
"FollowupByDate": "2026-01-12T22:22:46
"ContactMethod": "string",
"ContactName": "string",
"IsComplete": true,
"Comments": [
"string"
],
"T " [
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 80/181
```
Model Example Value
Model Example Value
Try it out!
Implementation Notes
This endpoint helps to merge clients.
```
Response Class (Status 200)
```
OK
```
{}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"SourceClientId": 0,
"TargetClientId": 0
```
}
```
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 81/181
```
```
POST /public/v{version}/client/sendautoemail Send a client a supported auto email
```
Model Example Value
Model Example Value
Implementation Notes
This endpoint requires staff user credentials.
```
Response Class (Status 200)
```
This endpoint causes auto email to be sent to the requested client. Email type passed in request needs to be enabled in
the core software. This endpoint does not return a response. If a call to this endpoint results in a 200 OK HTTP status code,
then the call was successful.
```
{}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClientId": "string",
"EmailType": "string"
```
}
```
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 82/181
```
Try it out!
```
POST /public/v{version}/client/sendpasswordresetemail Send a password reset email to a client.
```
Model Example Value
Model Example Value
Try it out!
```
Response Class (Status 200)
```
OK
```
{}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"UserEmail": "string",
"UserFirstName": "string",
"UserLastName": "string"
```
}
```
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 83/181
```
```
POST /public/v{version}/client/suspendcontract Suspend client contract
```
Model Example Value
Model Example Value
Try it out!
```
POST /public/v{version}/client/terminatecontract Terminate client contract.
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"Contract": {
```
"PayerClientId": 0,
"AgreementDate": "2026-01-12T22:22:46.609Z",
"AutopayStatus": "Active",
"AutoRenewing": true,
"FirstAutoPay": 0,
"LastAutoPay": 0,
"NormalAutoPay": 0,
"IsMonthToMonth": true,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClientId": "string",
"ClientContractId": 0,
"SuspensionType": "string",
"SuspensionStart": "2026-01-12T22:22:46
"Duration": 0,
"DurationUnit": 0,
"OpenEnded": true,
"SuspensionNotes": "string",
"SuspensionFee": 0
```
}
```
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 84/181
```
Model Example Value
Model Example Value
Try it out!
Implementation Notes
This endpoint terminates a client contract. This endpoint requires staff user credentials with TerminateClientContract
permission.
```
Response Class (Status 200)
```
OK
```
{
```
```
"Contract": {
```
"PayerClientId": 0,
"AgreementDate": "2026-01-12T22:22:46.611Z",
"AutopayStatus": "Active",
"AutoRenewing": true,
"FirstAutoPay": 0,
"LastAutoPay": 0,
"NormalAutoPay": 0,
"IsMonthToMonth": true,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClientId": "string",
"ClientContractId": 0,
"TerminationDate": "2026-01-12T22:22:46
"TerminationCode": "string",
"TerminationComments": "string"
```
}
```
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 85/181
```
```
POST /public/v{version}/client/updateclient Update a client at a site.
```
Implementation Notes
Starting the week of May 11th, 2020 all versions of the Public API will no longer allow duplicate clients to be created. This
applies to both adding a client and updating a client record. A duplicate client is created when two profiles have the same first
name, last name and email.
Updates an existing client for a specific subscriber.Passing a User Token as Authorization respects Business Mode required
fields.Omitting the token respects Consumer Mode required fields.To make sure you are collecting all required pieces of
information, first run GetRequiredClientFields.
. Use this endpoint as follows:
If you need to update the ReferredBy parameter, use this endpoint after calling GET ClientReferralTypes .
When updating a client's home location, use after calling GET Locations .
If you are updating a client's stored credit card, use after calling GET AcceptedCardTypes so that you can make sure
the card is a type that is accepted at the subscriber.
If this endpoint is used on a cross-regional site, passing in a client's RSSID and email address creates a cross-regional
link. This means that the client is created in cross-regional sites where the client does not exist and GET
CrossRegionalClientAssociations returns all appropriate cross-regional sites.
When CrossRegionalUpdate is omitted or set to true , the client's updated information is propagated to all of the
region's sites. If CrossRegionalUpdate is set to false , only the local client is updated.
```
Important: Starting in June 2025, the fields RSSID, Prefix, Name, Email, Birthday, Phone, and Address will automatically
```
update cross-regionally when changed, regardless of the CrossRegionalUpdate setting. The update is rolling out on a per
customer basis and is expected to complete to all customers by September 2025.
Note that the following items cannot be updated for a cross-regional client:
ClientIndexes
ClientRelationships
CustomClientFields
SalesReps
SendAccountEmails
SendAccountTexts
SendPromotionalEmails
SendPromotionalTexts
SendScheduleEmails
SendScheduleTexts
```
Gender (for site custom values)
```
Custom client Gender options can only be created with non-cross-regional requests.
If you have purchased an Ultimate tier then this endpoint will automatically start showing a new opportunity on Sales
Pipeline.It will create a new opportunity if the current request modify the contact as follows::
You need to update the IsProspect parameter, to true .
You need to update the ProspectStage . Description parameter , to New Lead .
Updates made to any inactive clients will automatically reactivate the client unless the Acive property is explicitly set to
false in the request body.
```
Response Class (Status 200)
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 86/181
```
Model Example Value
Model Example Value
Try it out!
```
POST /public/v{version}/client/updateclientcontractautopays
```
This endpoint can be used to update the amount and/or the item of a client’s autopay schedule.
OK
```
{
```
```
"Client": {
```
```
"SuspensionInfo": {
```
"BookingSuspended": true,
"SuspensionStartDate": "string",
"SuspensionEndDate": "string"
```
},
```
"AppointmentGenderPreference": "None",
"BirthDate": "2026-01-12T22:22:46.613Z",
"Country": "string",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
```
"Client": {
```
```
"SuspensionInfo": {
```
"BookingSuspended": true,
"SuspensionStartDate": "string",
"SuspensionEndDate": "string"
```
},
```
"AppointmentGenderPreference": "None"
"BirthDate": "2026-01-12T22:22:46.617
"Country": "string",
"CreationDate": "2026-01-12T22:22:46
"CustomClientFields": [
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 87/181
```
Model Example Value
Model Example Value
Try it out!
```
POST /public/v{version}/client/updateclientservice Update a client's purchase pricing option.
```
This endpoint can be used to update the amount and/or the item of a client’s autopay schedule.
```
Response Class (Status 200)
```
OK
```
{
```
"Id": 0,
"Name": "string",
"Description": "string",
"AssignsMembershipId": 0,
"AssignsMembershipName": "string",
"SoldOnline": true,
"ContractItems": [
```
{
```
"Id": "string",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClientContractId": 0,
"AutopayStartDate": "2026-01-12T22:22:4
"AutopayEndDate": "2026-01-12T22:22:46
"ProductId": 0,
"ReplaceWithProductId": 0,
"Amount": 0,
"OverwriteAllProductIDs": true
```
}
```
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 88/181
```
Model Example Value
Model Example Value
Implementation Notes
Updates the active date and/or expiration date of a client pricing option. This request requires staff user credentials. If the
active date is modified, the expiration date is also modified accordingly. If the expiration date is modified, the active date is
unchanged.
```
Response Class (Status 200)
```
OK
```
{
```
```
"ClientService": {
```
"ActiveDate": "2026-01-12T22:22:46.623Z",
"Count": 0,
"Current": true,
"ExpirationDate": "2026-01-12T22:22:46.623Z",
"Id": 0,
"ProductId": 0,
"Name": "string",
"PaymentDate": "2026-01-12T22:22:46.623Z",
```
{
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ServiceId": 0,
"ActiveDate": "2026-01-12T22:22:46.624Z
"ExpirationDate": "2026-01-12T22:22:46
"Count": 0,
"Test": true
```
}
```
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 89/181
```
Try it out!
```
POST /public/v{version}/client/updateclientvisit Update a client's visit.
```
Model Example Value
Model Example Value
Implementation Notes
Updates the status of the specified visit.
```
Response Class (Status 200)
```
OK
```
{
```
```
"Visit": {
```
"AppointmentId": 0,
"AppointmentGenderPreference": "None",
"AppointmentStatus": "None",
"ClassId": 0,
"ClientId": "string",
"ClientPhotoUrl": "string",
"ClientUniqueId": 0,
"StartDateTime": "2026-01-12T22:22:46.625Z",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"VisitId": 0,
"Makeup": true,
"SignedIn": true,
"ClientServiceId": 0,
"Execute": "string",
"Test": true,
"SendEmail": true
```
}
```
siteId -99 ID of the site
from which to
pull data.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 90/181
```
Try it out!
```
POST /public/v{version}/client/updatecontactlog Update a contact log on a client's account.
```
Model Example Value
Model Example Value
Parameter Value Description ParameterType Data Type
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
"Id": 0,
"Text": "string",
"CreatedDateTime": "2026-01-12T22:22:46.628Z",
"FollowupByDate": "2026-01-12T22:22:46.628Z",
"ContactMethod": "string",
"ContactName": "string",
```
"Client": {
```
"AppointmentGenderPreference": "None",
"BirthDate": "2026-01-12T22:22:46.628Z",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"Id": 0,
"Test": true,
"AssignedToStaffId": 0,
"Text": "string",
"ContactName": "string",
"FollowupByDate": "2026-01-12T22:22:46
"ContactMethod": "string",
"IsComplete": true,
"Comments": [
```
{
```
"Id": 0
siteId -99 ID of the
site from
which to
pull data.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 91/181
```
Try it out!
```
POST /public/v{version}/client/uploadclientdocument Upload a document to a client's profile.
```
Model Example Value
Model Example Value
Parameter Value Description ParameterType Data Type
```
version (required) path string
```
Implementation Notes
Uploads a document file for a specific client. Returns a string representation of the image byte array. The maximum size file
that can be uploaded is 4MB.
```
Response Class (Status 200)
```
OK
```
{
```
"FileSize": 0,
"FileName": "string"
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClientId": "string",
```
"File": {
```
"FileName": "string",
"MediaType": "string",
"Buffer": "string"
```
}
```
```
}
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 92/181
```
Try it out!
```
POST /public/v{version}/client/uploadclientphoto Upload a profile photo to a client's profile.
```
Model Example Value
Parameter Value Description ParameterType Data Type
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
Uploads a client’s profile photo. The maximum file size is 4 MB and acceptable file types are:
bmp
jpeg
gif
tiff
png
```
Response Class (Status 200)
```
OK
```
{
```
"ClientId": "string",
"PhotoUrl": "string"
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 93/181
```
Model Example Value
Try it out!
```
DELETE /public/v{version}/client/clientformulanote Deletes client's formula note.
```
Parameter Value Description ParameterType Data Type
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"Bytes": "string",
"ClientId": "string"
```
}
```
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint deletes an existing formula note. A staff user token must be included with staff assigned permission to view
client profile or have both ViewAppointmentDetails and ModifyAppointment permissions.
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to
0.
query integer
version 6 version of the api. header string
```
request.clientId (required) The client ID of the
```
client whose formula
note needs to be
deleted.
query string
```
request.formulaNoteId (required) The formula note ID
```
for the note to be
deleted.
query long
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 94/181
```
Try it out!
```
DELETE /public/v{version}/client/deletecontactlog Delete client's contact log.
```
Model Example Value
Parameter Value Description ParameterType Data Type
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Response Messages
HTTP Status Code Reason Response Model Headers
204 NoContent
Implementation Notes
This endpoint deletes contactlog of client. This endpoint requires staff user credentials.
```
Response Class (Status 200)
```
This endpoint does not return a response. If a call to this endpoint results in a 200 OK HTTP status code, then the call was
successful.
```
{}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.test When true , indicates
that this is a test request
and no data is inserted
into the subscriber’s
database. When
false , the database is
updated.
query boolean
version 6 version of the api. header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 95/181
```
Try it out!
CrossSite
```
POST /public/v{version}/crossSite/copycreditcard
```
Copies the credit card information from one client to another, regardless of site. The source and target clients must have the same email
address.
Model Example Value
Parameter Value Description ParameterType Data Type
```
request.clientId (required) The client ID of the
```
client whose Contact
Log is being deleted.
query string
```
request.contactLogId (required) The Contact Log ID. query long
```
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"CopiedFrom": {
```
"ClientId": "string",
"UniqueId": 0,
"SiteId": 0,
"FirstName": "string",
"LastName": "string"
```
},
```
```
"CopiedTo": {
```
"ClientId": "string",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 96/181
```
Model Example Value
Try it out!
Enrollment
```
GET /public/v{version}/enrollment/enrollments Get enrollments scheduled at a site.
```
Model Example Value
Parameter Value Description ParameterType Data Type
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"SourceSiteId": 0,
"SourceClientId": "string",
"SourceUniqueClientId": 0,
"TargetSiteId": 0,
"TargetClientId": "string",
"TargetUniqueClientId": 0
```
}
```
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
Returns a list of enrollments. An enrollment is a service, such as a workshop or an event, that a staff member offers to
multiple students, who commit to coming to all or most of the scheduled sessions. Enrollments typically run for a limited time
only.
When a user token is not passed with the request or the passed user token has insufficient viewing permissions, only the
following staff data is returned in the response:
FirstName
LastName
Id
Bio
DisplayName
ImageUrl
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 97/181
```
"TotalResults": 0
```
},
```
"Enrollments": [
```
{
```
"Classes": [
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.classScheduleIds Provide
multiple
values in
new lines.
A list of the requested
class schedule IDs. If
omitted, all class
schedule IDs return.
query Array[integer]
request.endDate The end of the date
range. The response
returns any active
enrollments that occur
on or before this day.
```
Default: StartDate
```
query date-time
request.limit Number of results to
include, defaults to
100
query integer
request.locationIds Provide
multiple
values in
new lines.
List of the IDs for the
requested locations. If
omitted, all location
IDs return.
query Array[integer]
request.offset Page offset, defaults to
0.
query integer
request.programIds Provide
multiple
values in
new lines.
List of the IDs for the
requested programs. If
omitted, all program
IDs return.
query Array[integer]
request.sessionTypeIds Provide
multiple
values in
new lines.
List of the IDs for the
requested session
types. If omitted, all
session types IDs
return.
query Array[integer]
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 98/181
```
Try it out!
```
POST /public/v{version}/enrollment/addclienttoenrollment Book a client into an enrollment.
```
Model Example Value
Parameter Value Description ParameterType Data Type
request.staffIds Provide
multiple
values in
new lines.
List of the IDs for the
requested staff IDs. If
omitted, all staff IDs
return.
query Array[long]
request.startDate The start of the date
range. The response
returns any active
enrollments that occur
on or after this day.
```
Default: today’s date
```
query date-time
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
"Classes": [
```
{
```
"ClassScheduleId": 0,
"Visits": [
```
{
```
"AppointmentId": 0,
"AppointmentGenderPreference": "None",
"AppointmentStatus": "None",
"ClassId": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 99/181
```
Model Example Value
Try it out!
```
POST /public/v{version}/enrollment/addenrollmentschedule
```
This endpoint adds a enrollment schedule. You can require clients to sign up for the entire enrollment schedule or allow them to pick specific
sessions using the AllowOpenEnrollment parameter.
Model Example Value
Parameter Value Description ParameterType Data Type
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClientId": "string",
"ClassScheduleId": 0,
"EnrollDateForward": "2026-01-12T22:22
"EnrollOpen": [
"2026-01-12T22:22:46.677Z"
],
"Test": true,
"SendEmail": true,
"Waitlist": true,
"WaitlistEntryId": 0
```
}
```
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
"ClassId": 0,
"ClassInstanceIds": [
0
]
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 100/181
```
Model Example Value
Try it out!
```
POST /public/v{version}/enrollment/updateenrollmentschedule This endpoint update a enrollment schedule.
```
Model Example Value
Parameter Value Description ParameterType Data Type
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClassDescriptionId": 0,
"LocationId": 0,
"StartDate": "2026-01-12T22:22:46.678Z"
"EndDate": "2026-01-12T22:22:46.678Z",
"StartTime": "2026-01-12T22:22:46.678Z"
"EndTime": "2026-01-12T22:22:46.678Z",
"DaySunday": true,
"DayMonday": true,
"DayTuesday": true,
"DayWednesday": true,
"DayThursday": true
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint update a enrollment schedule.
```
Response Class (Status 200)
```
OK
```
{
```
"ClassId": 0,
"ClassInstanceIds": [
0
]
```
}
```
Response Content Type application/json
Parameters
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 101/181
```
Model Example Value
Try it out!
Payroll
```
GET /public/v{version}/payroll/commissions Get commission payroll for staff members.
```
Model Example Value
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClassId": 0,
"ClassDescriptionId": 0,
"LocationId": 0,
"StartDate": "2026-01-12T22:22:46.680Z"
"EndDate": "2026-01-12T22:22:46.680Z",
"StartTime": "2026-01-12T22:22:46.680Z"
"EndTime": "2026-01-12T22:22:46.680Z",
"DaySunday": true,
"DayMonday": true,
"DayTuesday": true,
"DayWednesday": true
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
A staff authorization token is not required for this endpoint, but if one is passed, its permissions are honored. Depending on
the access permissions configured for the staff member whose token is passed, the endpoint returns either only the payroll
information for that staff member or it returns the payroll information for all staff members.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Commissions": [
```
{
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 102/181
```
"StaffId": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.endDateTime The end of the date range
for the payroll information to
be returned. The maximum
allowed date range is 14
days.
```
Default: Today’s date
```
If you do not supply an
EndDateTime , the
data returns for the
period from the
StartDateTime that
you supply to today’s
date.
If you do not supply an
EndDateTime or a
StartDateTime , data
returns for the seven
days prior to today’s
date.
query date-time
request.limit Number of results to
include, defaults to 100
query integer
request.locationId A LocationId that you want
to retrieve payroll
information for. If you do not
supply a LocationId ,
data from all locations is
returned.
query integer
request.offset Page offset, defaults to 0. query integer
request.staffId A list of staff IDs that you
want to retrieve payroll
information for. If you do not
supply a StaffId , all
active staff members return,
ordered by staff ID.
query long
request.startDateTime The beginning of the date
range for the payroll
information to be returned.
The maximum allowed date
range is 14 days.
query date-time
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 103/181
```
Try it out!
```
GET /public/v{version}/payroll/scheduledserviceearnings Get class payroll for staff members.
```
Model Example Value
Parameter Value Description ParameterType Data Type
If you do not supply a
StartDateTime , data
returns for the seven
days prior to the
EndDateTime that you
supply.
If you do not supply
either a
StartDateTime or an
EndDateTime , the
data returns for seven
days prior to today’s
date.
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
A staff authorization token is not required for this endpoint, but if one is passed, its permissions are honored. Depending on
the access permissions configured for the staff member whose token is passed, the endpoint returns either only the payroll
information for that staff member or it returns the payroll information for all staff members.
Note that if a staff member is not paid for a class, earnings of zero are returned by this endpoint.
Note that this endpoint calculates both bonus and no-reg rates for assistants.These rates are not supported by the Payroll
report in the web interface.
Note that this endpoint returns both the teacher’s adjusted rate and the assistant’s pay rate when the assistant is paid by the
teacher.The Payroll report in the web interface only returns the teacher’s adjusted rate.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"ScheduledServiceEarnings": [
```
{
```
"StaffId": 0,
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 104/181
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.endDateTime The end of the date range
for the payroll information
to be returned. The
maximum allowed date
range is 14 days.
```
Default: Today’s date
```
If you do not supply an
EndDateTime , the
data returns for the
period from the
StartDateTime that
you supply to today’s
date.
If you do not supply an
EndDateTime or a
StartDateTime , data
returns for the seven
days prior to today’s
date.
query date-time
request.limit Number of results to
include, defaults to 100
query integer
request.locationId A LocationId that you want
to retrieve payroll
information for. If you do
not supply a
LocationId , data from
all locations is returned.
query integer
request.offset Page offset, defaults to 0. query integer
request.scheduledServiceId Filters the results to a
single scheduled service.
This parameter must be
used with a single
ScheduledServiceType.
query long
request.scheduledServiceType Filters the results to
schedule service earnings
for specific types of
services. Possible values:
Class
Appointment
query string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 105/181
```
Try it out!
```
GET /public/v{version}/payroll/timecards Get time card payroll for staff members.
```
Model Example Value
Parameter Value Description ParameterType Data Type
request.staffId A list of staff IDs that you
want to retrieve payroll
information for. If you do
not supply a StaffId , all
active staff members
return, ordered by staff ID.
query long
request.startDateTime The beginning of the date
range for the payroll
information to be returned.
The maximum allowed date
range is 14 days.
If you do not supply a
StartDateTime , data
returns for the seven
days prior to the
EndDateTime that you
supply.
If you do not supply
either a
StartDateTime or an
EndDateTime , the
data returns for seven
days prior to today’s
date.
query date-time
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint returns information for all locations. The View reports for all locations permission is not supported for staff
auth tokens.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 106/181
```
"TotalResults": 0
```
},
```
"TimeCards": [
```
{
```
"S ff d" 0
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.endDateTime The end of the date range
for the payroll information to
be returned. The maximum
allowed date range is 14
days.
```
Default: Today’s date
```
If you do not supply an
EndDateTime , the
data returns for the
period from the
StartDateTime that
you supply to today’s
date.
If you do not supply an
EndDateTime or a
StartDateTime , data
returns for the seven
days prior to today’s
date.
query date-time
request.limit Number of results to
include, defaults to 100
query integer
request.locationId A LocationId that you want
to retrieve payroll
information for. If you do not
supply a LocationId ,
data from all locations is
returned.
query integer
request.offset Page offset, defaults to 0. query integer
request.staffId A list of staff IDs that you
want to retrieve payroll
information for. If you do not
supply a StaffId , all
active staff members return,
ordered by staff ID.
query long
request.startDateTime The beginning of the date
range for the payroll
information to be returned.
query date-time
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 107/181
```
Try it out!
```
GET /public/v{version}/payroll/tips Get tips for staff members.
```
Model Example Value
Parameter Value Description ParameterType Data Type
The maximum allowed date
range is 14 days.
If you do not supply a
StartDateTime , data
returns for the seven
days prior to the
EndDateTime that you
supply.
If you do not supply
either a
StartDateTime or an
EndDateTime , the
data returns for seven
days prior to today’s
date.
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
A staff authorization token is not required for this endpoint, but if one is passed, its permissions are honored. Depending on
the access permissions configured for the staff member whose token is passed, the endpoint returns either only the payroll
information for that staff member or it returns the payroll information for all staff members. This endpoint returns information
for all locations.The View reports for all locations permission is not supported for staff auth tokens.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Tips": [
```
{
```
"StaffId": 0,
Response Content Type application/json
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 108/181
```
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.endDateTime The end of the date range
for the payroll information to
be returned. The maximum
allowed date range is 14
days.
```
Default: Today’s date
```
If you do not supply an
EndDateTime , the
data returns for the
period from the
StartDateTime that
you supply to today’s
date.
If you do not supply an
EndDateTime or a
StartDateTime , data
returns for the seven
days prior to today’s
date.
query date-time
request.limit Number of results to
include, defaults to 100
query integer
request.locationId A LocationId that you want
to retrieve payroll
information for. If you do not
supply a LocationId ,
data from all locations is
returned.
query integer
request.offset Page offset, defaults to 0. query integer
request.staffId A list of staff IDs that you
want to retrieve payroll
information for. If you do not
supply a StaffId , all
active staff members return,
ordered by staff ID.
query long
request.startDateTime The beginning of the date
range for the payroll
information to be returned.
The maximum allowed date
range is 14 days.
If you do not supply a
StartDateTime , data
returns for the seven
days prior to the
query date-time
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 109/181
```
Try it out!
PickASpot
```
GET /public/v{version}/pickaspot/v1/class Get a list of classes as they relate to pick-a-spot.
```
Model Example Value
Parameter Value Description ParameterType Data Type
EndDateTime that you
supply.
If you do not supply
either a
StartDateTime or an
EndDateTime , the
data returns for seven
days prior to today’s
date.
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint supports pagination. See Pagination object for a description.
```
Response Class (Status 200)
```
OK
```
{
```
"classes": [
```
{
```
"SiteId": 0,
"LocationId": 0,
"ClassId": "string",
"ClassExternalId": "string",
"ClassName": "string",
"ClassStartTime": "2026-01-12T22:22:46.688Z",
"ClassEndTime": "2026-01-12T22:22:46.688Z",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 110/181
```
Try it out!
```
GET /public/v{version}/pickaspot/v1/class/{classId} Get a class filtered by classId.
```
Model Example Value
Try it out!
```
DELETE /public/v{version}/pickaspot/v1/reservation/{pathInfo} This endpoint deletes a single reservation.
```
Parameter Value Description ParameterType Data Type
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
Get a class filtered by classId.
```
Response Class (Status 200)
```
OK
```
{
```
"classes": [
```
{
```
"SiteId": 0,
"LocationId": 0,
"ClassId": "string",
"ClassExternalId": "string",
"ClassName": "string",
"ClassStartTime": "2026-01-12T22:22:46.690Z",
"ClassEndTime": "2026-01-12T22:22:46.690Z",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
```
classId (required) path string
```
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 111/181
```
Model Example Value
Try it out!
```
GET /public/v{version}/pickaspot/v1/reservation/{pathInfo} Retrieves reservation for Pick a Spot.
```
Model Example Value
Implementation Notes
A user token is required for this endpoint. This endpoint deletes a single reservation.
```
Response Class (Status 200)
```
OK
```
{
```
"Headers": [
```
{
```
"key": "string",
"value": [
"string"
]
```
}
```
]
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
```
pathInfo (required) path string
```
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
Retrieves reservation for Pick a Spot.
```
Response Class (Status 200)
```
OK
```
{
```
"Reservations": [
```
{
```
"ReservationId": "string",
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 112/181
```
Try it out!
```
POST /public/v{version}/pickaspot/v1/reservation/{pathInfo} Creates a reservation for a given pick-a-spot class.
```
Model Example Value
"ReservationExternalId": "string",
"ClassId": "string",
"ClassExternalId": "string",
"MemberExternalId": "string",
"ReservationType": "string",
```
"Spots": {
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
```
pathInfo (required) path string
```
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
Creates a spot reservation for a given pick-a-spot class. The actual class visit must be created prior to calling this endpoint. A
user token is required for this endpoint.
Sample request:
POST /pickaspot/v1/reservation
```
{
```
"SiteId": -1147483363,
"LocationId": 1,
"ClassId": "64b14ac8c20ae8f0afd2d409",
"ReservationExternalId": "44724", // this is a Visit.Id and should be linked to a specific class visit
"MemberExternalId": "100000136", // this is Client's UniqueId
"SpotNumber": "5",
"ReservationDisplayName": "ReservationDisplayName", // optional
"ReservationType": "Member", // optional. Can be Member, Guest, Instructor, FamilyMember,
"AutoConfirm": false, // optional. Default: false
"AutoAssignSpot": false // optional. It will override the "SpotNumber" passed and auto assign one. Defa
```
}
```
```
Response Class (Status 200)
```
OK
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 113/181
```
Try it out!
```
PUT /public/v{version}/pickaspot/v1/reservation/{pathInfo} This endpoint updates a single reservation.
```
Model Example Value
```
{
```
```
"Reservation": {
```
"ReservationId": "string",
"ReservationExternalId": "string",
"ClassId": "string",
"ClassExternalId": "string",
"MemberExternalId": "string",
"ReservationType": "string",
```
"Spots": {
```
"ReservedSpotNumbers": [
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
```
pathInfo (required) path string
```
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
A user token is required for this endpoint. This endpoint updates a single reservation.
```
Response Class (Status 200)
```
OK
```
{
```
```
"Reservation": {
```
"ReservationId": "string",
"ReservationExternalId": "string",
"ClassId": "string",
"ClassExternalId": "string",
"MemberExternalId": "string",
"ReservationType": "string",
```
"Spots": {
```
"ReservedSpotNumbers": [
Response Content Type application/json
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 114/181
```
Try it out!
PricingOption
```
POST /public/v{version}/pricingoption/updatepricingoption
```
```
Update Pricing Option data such as name, details, price, discontinued using PricingOptionId(product id)
```
Model Example Value
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
```
pathInfo (required) path string
```
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 115/181
```
Model Example Value
Try it out!
Sale
```
GET /public/v{version}/sale/acceptedcardtypes Get credit cards types that a site accepts.
```
Model Example Value
Parameter Value Description ParameterType Data Type
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ProductId": 0,
"Name": "string",
"Price": 0,
"OnlinePrice": 0,
"Count": 0,
"SellOnline": true,
"RevenueCategory": "string",
"Discontinued": true,
"MembershipId": 0,
"IsThirdPartyDiscountPricing": true,
"P i it " " t i "
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
Gets a list of card types that the site accepts. You can also use GET Sites to return the Site object, which contains
individual accepted card types for requested sites.
This endpoint has no query parameters.The response returns a list of strings. Possible values are:
Visa
MasterCard
Discover
AMEX
```
Response Class (Status 200)
```
OK
[
"string"
]
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 116/181
```
Try it out!
```
GET /public/v{version}/sale/alternativepaymentmethods
```
Get alternative and local payment methods that are allowed for a site.
Model Example Value
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
Get alternative and local payment methods that are allowed for a site. These payment methods can later be used in
Initiate Checkout Shopping Cart Using Alternative Payments and Initiate Purchase Contract
Using Alternative Payments to make the payment.
The currently supported alternative payments are:
iDEAL
Apple Pay
```
Notes:
```
```
This endpoint is only available for Studios on MBPS (Mindbody Payments) with Stripe payment processor.
```
```
This endpoint only supports the online store location (LocationId = 98). If LocationId is not provided, it will default to 98.
```
```
Response Class (Status 200)
```
OK
```
{
```
"PaymentMethods": [
```
{
```
"Id": 0,
"Name": "string"
```
}
```
]
```
}
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 117/181
```
Try it out!
```
GET /public/v{version}/sale/contracts Get contracts available for purchase at a site.
```
Model Example Value
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.clientId The client ID query string
request.locationId The location ID Default:
```
null (Online store
```
```
location)
```
query integer
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
Returns the contracts and autopay options that are available on a location-by-location basis. Depending on the configurations
established by the site, this endpoint returns options that can be used to sign up clients for recurring payments for services
offered by the business.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Contracts": [
```
{
```
"Id": 0,
Response Content Type application/json
Parameters
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 118/181
```
Try it out!
```
GET /public/v{version}/sale/custompaymentmethods Get payment methods that can be used to pay for sales at a site.
```
Model Example Value
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.contractIds Provide
multiple
values in
new lines.
When included, the
response only contains
details about the
specified contract IDs.
query Array[integer]
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to
0.
query integer
request.promoCode PromoCode to apply query string
request.soldOnline When true , the
response only contains
details about contracts
and AutoPay options
that can be sold online.
When false , all
contracts are returned.
```
Default: false
```
query boolean
request.uniqueClientId The ID of the client. query long
version 6 version of the api. header string
```
request.locationId (required) The ID of the location
```
that has the
requested contracts
and AutoPay options.
query integer
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
Get payment methods that can be used to pay for sales at a site.
```
Response Class (Status 200)
```
OK
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 119/181
```
Try it out!
```
GET /public/v{version}/sale/giftcardbalance Get a gift card's remaining balance.
```
Model Example Value
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"PaymentMethods": [
```
{
```
"Id": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to 0. query integer
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
Returns a gift card’s remaining balance.
```
Response Class (Status 200)
```
OK
```
{
```
"BarcodeId": "string",
"RemainingBalance": 0
```
}
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 120/181
```
Try it out!
```
GET /public/v{version}/sale/giftcards Get gift cards available for purchase at a site.
```
Model Example Value
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
barcodeId The barcode ID of the gift
card for which you want
the balance.
query string
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
Returns information about gift cards that can be purchased.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"GiftCards": [
```
{
```
"Id": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 121/181
```
Try it out!
```
GET /public/v{version}/sale/packages Get packages available for purchase at a site.
```
Model Example Value
Parameter Value Description ParameterType Data Type
request.ids Provide
multiple
values in
new lines.
Filters the results to
the requested gift
card IDs.
```
Default: all gift cards.
```
query Array[integer]
request.includeCustomLayouts When true ,
includes custom gift
card layouts.
When false ,
includes only system
layouts. Default:
false
query boolean
request.limit Number of results to
include, defaults to
100
query integer
request.locationId When included,
returns gift cards that
are sold at the
provided location ID.
query integer
request.offset Page offset, defaults
to 0.
query integer
request.soldOnline When true , only
returns gift cards that
are sold online.
```
Default: false
```
query boolean
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
A package is typically used to combine multiple services and/or products into a single offering. Staff members can check out
multiple appointments while selling the package, and can discount the items included. For example, a spa might bundle a
massage, a pedicure, a manicure, a facial, and a few selected beauty products into a package.
```
Response Class (Status 200)
```
OK
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 122/181
```
Try it out!
```
{
```
"Packages": [
```
{
```
"Id": 0,
"Name": "string",
"DiscountPercentage": 0,
"SellOnline": true,
"Services": [
```
{
```
"Price": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.limit Number of results to
include, defaults to 100
query integer
request.locationId The location ID to use to
determine the tax for the
products that this
request returns.
```
Default: online store
```
query integer
request.offset Page offset, defaults to
0.
query integer
request.packageIds Provide
multiple
values in
new lines.
A list of the packages
IDs to filter by.
query Array[integer]
request.sellOnline When true , only
returns products that can
be sold online.
When false , all
products are returned.
```
Default: false
```
query boolean
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 123/181
```
```
GET /public/v{version}/sale/products Get retail products available for purchase at a site.
```
Model Example Value
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Products": [
```
{
```
"ProductId": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.categoryIds Provide
multiple
values in
new lines.
A list of revenue
category IDs to filter
by. Use this ID when
calling the GET
Categories endpoint.
query Array[integer]
request.limit Number of results to
include, defaults to
100
query integer
request.locationId The location ID to
use to determine the
tax for the products
that this request
returns.
```
Default: online store
```
query integer
request.offset Page offset, defaults
to 0.
query integer
request.productIds Provide
multiple
values in
new lines.
The barcode number
of the product to be
filter by.
query Array[string]
request.searchText A search filter, used
for searching by
query string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 124/181
```
Try it out!
```
PUT /public/v{version}/sale/products Update retail products available for purchase at a site.
```
Model Example Value
Parameter Value Description ParameterType Data Type
term.
request.secondaryCategoryIds Provide
multiple
values in
new lines.
A list of secondary
categories to filter by.
Use this ID when
calling the GET
Categories endpoint.
query Array[integer]
request.sellOnline When true , only
products that can be
sold online are
returned.
When false , all
products are
returned.
```
Default: false
```
query boolean
request.subCategoryIds Provide
multiple
values in
new lines.
A list of subcategory
IDs to filter by. Use
this ID when calling
the GET Categories
endpoint.
query Array[integer]
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Products": [
```
{
```
"ProductId": 0,
Response Content Type application/json
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 125/181
```
Model Example Value
Try it out!
```
GET /public/v{version}/sale/productsinventory Get retail products inventory data available at a site.
```
Model Example Value
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
siteId -99 ID of the
site from
which to
pull data.
header string
```
updateProductsRequests (required)
```
Parameter content type:
application/json
body
[
```
{
```
"BarcodeId": "string",
"Price": 0,
"OnlinePrice": 0
```
}
```
]
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"ProductsInventory": [
```
{
```
"ProductId": 0,
Response Content Type application/json
Parameters
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 126/181
```
Try it out!
```
GET /public/v{version}/sale/purchasecontractstatus Fetches the status of an initiate purchase contract given accessToken.
```
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.barcodeIds Provide
multiple
values in
new lines.
When included, the
response only contains
details about the
specified Barcode Ids.
query Array[string]
request.limit Number of results to
include, defaults to 100
query integer
request.locationIds Provide
multiple
values in
new lines.
When included, the
response only contains
details about the
specified location Ids.
query Array[integer]
request.offset Page offset, defaults to
0.
query integer
request.productIds Provide
multiple
values in
new lines.
When included, the
response only contains
details about the
specified product Ids.
query Array[string]
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
Fetches the status of an initiate purchase contract given accessToken. This endpoint complements the Initiate
Purchase Contract Using Alternative Payments endpoint. Initiate Purchase Contract Using
Alternative Payments endpoint will capture the intent to purchase a contract, and return a redirect URL for the end user
to make the payment. Once the payment concludes, the end user will be redirected back to the
PaymentAuthenticationCallbackUrl, which was provided while invoking the Initiate Purchase Contract Using
Alternative Payments endpoint. You can then invoke this endpoint to obtain the PurchaseContractResponse .
For a comprehensive guide, follow this tutorial: Purchase a Contract
The currently supported alternative payments are:
iDEAL
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 127/181
```
Model Example Value
Try it out!
```
GET /public/v{version}/sale/sales Get sales completed at a site.
```
Model Example Value
Apple Pay
```
Response Class (Status 200)
```
OK
```
{
```
"ClientId": "string",
"UniqueClientId": 0,
"LocationId": 0,
"ContractId": 0,
"ClientContractId": 0,
```
"Totals": {
```
"Total": 0,
"SubTotal": 0,
"Discount": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
```
accessToken (required) query string
```
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
Get sales completed at a site.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 128/181
```
Try it out!
```
GET /public/v{version}/sale/services Get pricing options available for purchase at a site
```
"Sales": [
```
{
```
"Id": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.endSaleDateTime Filters results to sales
that happened before
this date and time.
query date-time
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to
0.
query integer
request.paymentMethodId Filters results to sales
paid for by the given
payment method ID
which indicates
```
payment method(s)
```
```
(i.e. cash, VISA,
```
```
AMEX, Check, etc.).
```
query integer
request.saleId The sale ID associated
with the particular item.
It Filters results to the
requested sale ID.
query long
request.startSaleDateTime Filters results to sales
that happened after
this date and time.
query date-time
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
Get pricing options available for purchase at a site
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 129/181
```
Model Example Value
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Services": [
```
{
```
"Price": 0,
"O li i " 0
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.classId Filters to the pricing options
for the specified class ID.
query integer
request.classScheduleId Filters to the pricing options
for the specified class
schedule ID.
query integer
request.hideRelatedPrograms When true , indicates that
pricing options of related
programs are omitted from
the response.
```
Default: false
```
query boolean
request.includeDiscontinued When true , indicates that
the filtered pricing option list
includes discontinued
pricing options.
```
Default: false
```
query boolean
request.includeSaleInContractOnly When true , indicates that
the filtered pricing option list
includes sale in contract
only pricing options.
```
Default: false
```
query boolean
request.limit Number of results to
include, defaults to 100
query integer
request.locationId When specified, for each
returned pricing option,
TaxRate and
query integer
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 130/181
```
Parameter Value Description ParameterType Data Type
TaxIncluded are
calculated according to the
specified location. Note that
this does not filter results to
only services provided at
the given location, and for
locations where Value-
```
Added Tax (VAT) rules
```
apply, the TaxRate is set
to zero.
request.offset Page offset, defaults to 0. query integer
request.programIds Provide
multiple
values in
new lines.
Filters to pricing options
with the specified program
IDs.
query Array[integer]
request.sellOnline When true , filters the
pricing options to display
only those available for
online purchase. This
parameter is only applicable
```
in Business Mode (when a
```
staff authentication header
```
is included) and ignored in
```
```
Consumer Mode (when no
```
authentication header is
```
passed).
```
```
Default: false (for staff
```
```
users)
```
Business Mode: This
parameter controls the
filtering behavior. Staff
users can set this to true
to show only pricing options
that can be sold online, or
false to show all
available pricing options.
Consumer Mode: This value
is automatically set to
true and cannot be
overridden, ensuring
consumers only see pricing
options available for online
purchase.
query boolean
request.serviceIds Provide
multiple
values in
new lines.
Filters to the pricing options
with the specified IDs. In
this context, service and
pricing option are used
interchangeably. These are
the
query Array[string]
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 131/181
```
Try it out!
```
PUT /public/v{version}/sale/services Update unit price and online price of provided services.
```
Model Example Value
Parameter Value Description ParameterType Data Type
PurchasedItems[].Id
returned from GET Sales.
request.sessionTypeIds Provide
multiple
values in
new lines.
Filters to the pricing options
with the specified session
types IDs.
query Array[integer]
request.staffId Sets Price and
OnlinePrice to the
particular pricing of a
specific staff member, if
allowed by the business.
query long
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
Update unit price and online price of provided services.
```
Response Class (Status 200)
```
OK
```
{
```
"Services": [
```
{
```
"Price": 0,
"OnlinePrice": 0,
"TaxIncluded": 0,
"ProgramId": 0,
"TaxRate": 0,
"ProductId": 0,
"Id": "string",
Response Content Type application/json
Parameters
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 132/181
```
Model Example Value
Try it out!
```
GET /public/v{version}/sale/transactions Get transactions completed at a site.
```
Model Example Value
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
siteId -99 ID of the
site from
which to
pull data.
header string
```
updateServicesRequest (required)
```
Parameter content type:
application/json
body
[
```
{
```
"BarcodeId": "string",
"Price": 0,
"OnlinePrice": 0
```
}
```
]
```
version (required) path string
```
Implementation Notes
This endpoint returns a list of transaction details of processed sales.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Transactions": [
```
{
```
"TransactionId": 0,
Response Content Type application/json
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 133/181
```
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.clientId Filters results to the
requested client ID.
query long
request.limit Number of results to
include, defaults to
100
query integer
request.locationId Filters the
transaction results
with the ID number
associated with the
location of the sale.
query integer
request.offset Page offset, defaults
to 0.
query integer
request.saleId Filters the
transaction results
with the ID number
associated with the
sale.
query long
request.status Filters the
transaction results by
the estimated
transaction status.
query string
request.transactionEndDateTime Filters the
transaction results
that happpened
before this date and
time. Default:
today’s date
query date-time
request.transactionId Filters the
transaction results
with the ID number
generated when the
sale is processed.
query integer
request.transactionStartDateTime Filters the
transaction results
that happpened after
this date and time.
```
Default: today’s
```
date
query date-time
version 6 version of the api. header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 134/181
```
Try it out!
```
POST /public/v{version}/sale/checkoutshoppingcart Purchase pricing options, packages, retail products, or tips for a client.
```
Model Example Value
Parameter Value Description ParameterType Data Type
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint provides a wide range of functionality. For example, you can use it when a client purchases new pricing options,
retail products, packages, and tips. You can also combine purchasing a new pricing option and many other functions, such as
booking a client into a class, booking a new appointment for a client, enrolling a client into an enrollment or course, or
reconciling an unpaid, already booked appointment or class. Use this call when a client purchases:
a pricing option, after calling GET Services and choosing a specific pricing option’s ID
a retail product, after calling GET Products and choosing a specific retail product’s ID
a package, after calling GET Packages and choosing a specific package’s ID
a tip to give to a staff member, after calling GET Staff and choosing a specific staff member ID, and the amount that the
client wants to tip The documentation provides explanations of the request body and response, as well as the cart item
metadata, payment item metadata, and purchased cart items. This endpoint had been updated to support Strong Customer
```
Authentication (SCA). Note : Protect yourself from processor fees and credit card fraud.Remember to always protect your
```
web forms that leverage POST CheckoutShoppingCart, POST PurchaseContract or POST PurchaseGiftCard with a
CAPTCHA!
```
Response Class (Status 200)
```
OK
```
{
```
```
"ShoppingCart": {
```
"Id": "string",
"CartItems": [
```
{
```
```
"Item": {},
```
"SalesNotes": "string",
"DiscountAmount": 0,
"VisitIds": [
0
]
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 135/181
```
Model Example Value
Try it out!
```
POST /public/v{version}/sale/completecheckoutshoppingcart
```
Complete the Checkout Shopping Cart process, after the payments have been made by the client.
Parameter Value Description ParameterType Data Type
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"CartId": "string",
"ClientId": "string",
"UniqueClientId": 0,
"PayerClientId": "string",
"UniquePayerClientId": 0,
"Test": true,
"Items": [
```
{
```
```
"Item": {
```
"Type": "string",
```
"Metadata": {}
```
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint complements the InitiateCheckoutShoppintCart endpoint. Please visit its documentation to understand further.
The currently supported alternative payments are:
iDEAL
Apple Pay
How to use : InitiateCheckoutShoppingCart and CompleteCheckoutShoppingCart endpoints work together.
InitiateCheckoutShoppingCart endpoint will capture the intent to perform a checkout, and return a redirect URL for the end
user to make the payment. Once the payment concludes, the end user will be redirected back to the
PaymentAuthenticationCallbackUrl, which was provided while invoking the InitiateCheckoutShoppingCart endpoint. You can
then invoke the CompleteCheckoutShoppingCart endpoint to complete the remaining checkout activities and obtain the
CheckoutShoppingCartResponse.
For a comprehensive guide, follow this tutorial: Checkout Shopping Cart Using Alternative Payments
```
Notes:
```
```
This endpoint is only available for Studios on MBPS (Mindbody Payments) with Stripe payment processor.
```
Protect yourself from processor fees. Remember to always protect your web forms that leverage POST
InitiateCheckoutShoppingCart or POST CompleteCheckoutShoppingCart with a CAPTCHA!
```
Response Class (Status 200)
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 136/181
```
Model Example Value
Model Example Value
Try it out!
```
POST /public/v{version}/sale/initiatecheckoutshoppingcart
```
Initiate the Checkout Shopping Cart process, for payments to be made directly by the client.
OK
```
{
```
```
"ShoppingCart": {
```
"Id": "string",
"CartItems": [
```
{
```
```
"Item": {},
```
"SalesNotes": "string",
"DiscountAmount": 0,
"VisitIds": [
0
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"AccessToken": "string",
"ClientId": "string",
"Test": true
```
}
```
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint provides a wide range of functionality. For example, you can use it when a client purchases new pricing options,
retail products, packages, and tips. You can also combine purchasing a new pricing option and many other functions, such as
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 137/181
```
Model Example Value
booking a client into a class, booking a new appointment for a client, enrolling a client into an enrollment or course, or
reconciling an unpaid, already booked appointment or class. Use this call when a client purchases:
a pricing option, after calling GET Services and choosing a specific pricing option’s ID
a retail product, after calling GET Products and choosing a specific retail product’s ID
a package, after calling GET Packages and choosing a specific package’s ID
a tip to give to a staff member, after calling GET Staff and choosing a specific staff member ID, and the amount that the
client wants to tip The documentation provides explanations of the request body and response, as well as the cart item
metadata, payment item metadata, and purchased cart items.
The currently supported alternative payments are:
iDEAL
Apple Pay
How to use : InitiateCheckoutShoppingCart and CompleteCheckoutShoppingCart endpoints work together.
InitiateCheckoutShoppingCart endpoint will capture the intent to perform a checkout, and return a redirect URL for the end
user to make the payment. Once the payment concludes, the end user will be redirected back to the
PaymentAuthenticationCallbackUrl, which was provided while invoking the InitiateCheckoutShoppingCart endpoint. You can
then invoke the CompleteCheckoutShoppingCart endpoint to complete the remaining checkout activities and obtain the
CheckoutShoppingCartResponse.
For a comprehensive guide, follow this tutorial: Checkout Shopping Cart Using Alternative Payments
```
Notes:
```
```
This endpoint is only available for Studios on MBPS (Mindbody Payments) with Stripe payment processor.
```
```
This endpoint only supports the online store location (LocationId = 98). If LocationId is not provided, it will default to 98.
```
Product purchases are currently not supported on the online store location.
This endpoint only supports those payment methods as obtained from the GetAlternativePaymentMethods endpoint.
Protect yourself from processor fees. Remember to always protect your web forms that leverage POST
InitiateCheckoutShoppingCart or POST CompleteCheckoutShoppingCart with a CAPTCHA!
```
Response Class (Status 200)
```
OK
```
{}
```
Response Content Type application/json
Parameters
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 138/181
```
Model Example Value
Try it out!
```
POST /public/v{version}/sale/initiatepurchasecontract Purchase a contract for a client using apm/lpm.
```
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"CartId": "string",
"ClientId": "string",
"PayerClientId": "string",
"Test": true,
"Items": [
```
{
```
```
"Item": {
```
"Type": "string",
```
"Metadata": {}
```
```
},
```
"SalesNotes": "string"
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
Allows a client to sign up for a contract or autopay using the information returned from the GET Contracts endpoint. The
client can pay with allowed alternative and local payment methods returned from Get Alternative Payment Method .
The client must exist at the site specified before this call is made.
The currently supported alternative payments are:
iDEAL
Apple Pay
For a comprehensive guide, follow this tutorial: Purchase a Contract
```
Notes:
```
```
This endpoint is only available for Studios on MBPS (Mindbody Payments) with Stripe payment processor.
```
```
This endpoint only supports the online store location (LocationId = 98). If LocationId is not provided, it will default to 98.
```
This endpoint only supports those payment methods as obtained from the GetAlternativePaymentMethods endpoint.
Protect yourself from processor fees and credit card fraud. Remember to always protect your web forms that leverage
POST CheckoutShoppingCart, POST PurchaseContract or POST PurchaseGiftCard with a CAPTCHA!
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 139/181
```
Model Example Value
Model Example Value
Try it out!
```
POST /public/v{version}/sale/purchaseaccountcredit Purchases account credit for a client
```
```
Response Class (Status 200)
```
OK
```
{}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"Test": true,
"LocationId": 0,
"ClientId": "string",
"ContractId": 0,
"PromotionCode": "string",
"PromotionCodes": [
"string"
],
"SendNotifications": true,
"SalesRepId": 0,
"PaymentAuthenticationCallbackUrl": "st
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 140/181
```
Model Example Value
Model Example Value
Try it out!
```
POST /public/v{version}/sale/purchasecontract Purchase a contract for a client.
```
Allows a client to purchase account credit from a business.
```
Response Class (Status 200)
```
OK
```
{
```
"AmountPaid": 0,
"ClientId": "string",
"SaleId": 0,
"EmailReceipt": true,
"PaymentProcessingFailures": [
```
{
```
"Type": "string",
"Message": "string",
"AuthenticationRedirectUrl": "string"
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"Test": true,
"LocationId": 0,
"ClientId": "string",
"SendEmailReceipt": true,
"SalesRepId": 0,
"ConsumerPresent": true,
"PaymentAuthenticationCallbackUrl": "st
```
"PaymentInfo": {
```
"Type": "string",
```
"Metadata": {}
```
```
}
```
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 141/181
```
Model Example Value
Model Example Value
Implementation Notes
Allows a client to sign up for a contract or autopay using the information returned from the GET Contracts endpoint. The
client can pay with a new credit card or with a stored credit card. The client must exist at the site specified before this call is
made.
This endpoint allows a developer to specify whether a client pays now or pays on the StartDate . If you are building a
client-facing experience, you should talk with the business owner to understand the owner’s policies before you give clients a
choice of the two payment types. This endpoint also allows a developer to specify a ProrateDate . If the date is passed, the
Totals returned will always include the pro-rate amount for instant payment, like:
```
FirstPaymentOccurs = Instant => returns instant payment total for the contract + pro-rate amount.
```
```
FirstPaymentOccurs = StartDate => returns pro-rate amount + contract amount requiring instant payment. The
```
rest of the contract will be due on StartDate .
Pro-rate amount payment on StartDate is not supported by this endpoint. This endpoint has been updated to support
```
Strong Customer Authentication (SCA).
```
```
Note: Protect yourself from processor fees and credit card fraud. Remember to always protect your web forms that leverage
```
POST CheckoutShoppingCart, POST PurchaseContract or POST PurchaseGiftCard with a CAPTCHA!
```
Response Class (Status 200)
```
OK
```
{
```
"ClientId": "string",
"UniqueClientId": 0,
"LocationId": 0,
"ContractId": 0,
"ClientContractId": 0,
```
"Totals": {
```
"Total": 0,
"SubTotal": 0,
"Discount": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required) body
```
```
{
```
"Test": true,
"LocationId": 0,
"ClientId": "string",
"UniqueClientId": 0,
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 142/181
```
Try it out!
```
POST /public/v{version}/sale/purchasegiftcard Purchase a gift card for a client.
```
Model Example Value
Parameter Value Description ParameterType Data Type
Parameter content type:
application/json
"ContractId": 0,
"StartDate": "2026-01-12T22:22:46.770Z"
"FirstPaymentOccurs": "string",
"ClientSignature": "string",
"PromotionCode": "string",
"PromotionCodes": [
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
Allows a client to purchase a gift card from a business in a variety of designs. The card can be emailed to the recipient on a
specific day, and a card title and a personal message can be added. Note Protect yourself from processor fees and credit
card fraud.Remember to always protect your web forms that leverage POST CheckoutShoppingCart, POST
PurchaseContract or POST PurchaseGiftCard with a CAPTCHA!
```
Response Class (Status 200)
```
OK
```
{
```
"BarcodeId": "string",
"Value": 0,
"AmountPaid": 0,
"FromName": "string",
"LayoutId": 0,
"EmailReceipt": true,
"PurchaserClientId": "string",
"PurchaserEmail": "string",
"RecipientEmail": "string",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 143/181
```
Model Example Value
Try it out!
```
POST /public/v{version}/sale/returnsale Retunn sale
```
Model Example Value
Parameter Value Description ParameterType Data Type
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"Test": true,
"LocationId": 0,
"LayoutId": 0,
"PurchaserClientId": "string",
"GiftCardId": 0,
"SendEmailReceipt": true,
"RecipientEmail": "string",
"RecipientName": "string",
"Title": "string",
"GiftMessage": "string",
"D li D t " "2026 01 12T22 22 46 77
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
Return a comped sale for a specified sale ID in business mode. The sale is returnable only if it is a sale of a service, product
or gift card and it has not been used. Currently, only the comp payment method is supported.
```
Response Class (Status 200)
```
OK
```
{
```
"ReturnSaleID": 0,
"TrainerID": 0,
"Amount": 0
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 144/181
```
Model Example Value
Try it out!
```
POST /public/v{version}/sale/updateproductprice Update retail product's unit and online price.
```
Model Example Value
Parameter Value Description ParameterType Data Type
token.
version 6 version of
the api.
header string
```
returnSaleRequest (required)
```
Parameter content type:
application/json
body
```
{
```
"SaleId": 0,
"ReturnReason": "string"
```
}
```
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint updates the retail price and an online price for a product. Passing at least one of them is mandatory.
```
Response Class (Status 200)
```
OK
```
{
```
```
"Product": {
```
"ProductId": 0,
"Id": "string",
"CategoryId": 0,
"SubCategoryId": 0,
"SecondaryCategoryId": 0,
"Price": 0,
"TaxIncluded": 0,
"TaxRate": 0,
Response Content Type application/json
Parameters
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 145/181
```
Model Example Value
Try it out!
```
PUT /public/v{version}/sale/updatesaledate This endpoint updates the SaleDate and returns the details of the sale.
```
Model Example Value
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"BarcodeId": "string",
"Price": 0,
"OnlinePrice": 0
```
}
```
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint updates the SaleDate and returns the details of the sale.
```
Response Class (Status 200)
```
OK
```
{
```
```
"Sale": {
```
"Id": 0,
"SaleDate": "2026-01-12T22:22:46.776Z",
"SaleTime": "string",
"SaleDateTime": "2026-01-12T22:22:46.776Z",
"OriginalSaleDateTime": "2026-01-12T22:22:46.776Z",
"SalesRepId": 0,
"ClientId": "string",
"RecipientClientId": 0,
Response Content Type application/json
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 146/181
```
Model Example Value
Try it out!
Site
```
GET /public/v{version}/site/activationcode Get an activation code for a site.
```
Model Example Value
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"SaleID": 0,
"SaleDate": "2026-01-12T22:22:46.778Z"
```
}
```
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
Before you can use this endpoint, MINDBODY must approve your developer account for live access. If you have finished
testing in the sandbox and are ready to begin working with MINDBODY customers, log into your account and request to go
live.
See Accessing Business Data From MINDBODY for more information about the activation code and how to use it.
Once you are approved, this endpoint returns an activation code.This endpoint supports only one site per call.
```
Response Class (Status 200)
```
OK
```
{
```
"ActivationCode": "string",
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 147/181
```
Try it out!
```
GET /public/v{version}/site/categories Gets the categories.
```
Model Example Value
"ActivationLink": "string"
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Categories": [
```
{
```
"Id": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.active When true , the
response only contains
categories which are
activated. When
false , only
deactivated categories
query boolean
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 148/181
```
Try it out!
```
GET /public/v{version}/site/genders Get the gender options at a site.
```
Model Example Value
Parameter Value Description ParameterType Data Type
are returned. Default:
All Categories
request.categoryIds Provide
multiple
values in
new lines.
When included, the
response only contains
details about the
specified category Ids.
query Array[integer]
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to
0.
query integer
request.service When true , the
response only contains
details about Revenue
Categories. When
false , only Product
Revenue Categories
are returned. Default:
All Categories
query boolean
request.subCategoryIds Provide
multiple
values in
new lines.
When included, the
response only contains
details about the
specified subcategory
Ids.
query Array[integer]
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
The endpoint returns a list of configured client gender options for a site. Custom gender options are assignable to client
genders only. Currently, custom values returned from this endpoint cannot be used as input for other endpoints to specify the
genders of staff or client preferences.
```
Response Class (Status 200)
```
OK
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 149/181
```
Try it out!
```
GET /public/v{version}/site/liabilitywaiver Gets Liability Waiver content
```
Model Example Value
```
{
```
"GenderOptions": [
```
{
```
"Id": 0,
"Name": "string",
"IsActive": true,
"IsDefault": true
```
}
```
]
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
Gets Liability Waiver content at the specified business. This endpoint requires staff user credentials.
```
Response Class (Status 200)
```
OK
```
{
```
"LiabilityWaiver": "string"
```
}
```
Response Content Type application/json
Parameters
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 150/181
```
Try it out!
```
GET /public/v{version}/site/locations Get locations for a site.
```
Model Example Value
Try it out!
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Locations": [
```
{
```
"AdditionalImageURLs": [
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to 0. query integer
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 151/181
```
```
GET /public/v{version}/site/memberships Get the memberships at a site.
```
Model Example Value
Try it out!
```
GET /public/v{version}/site/mobileproviders Gets a list of active mobile providers for the site.
```
Model Example Value
```
Response Class (Status 200)
```
OK
```
{
```
"Memberships": [
```
{
```
"MembershipId": 0,
"MembershipName": "string",
"Priority": 0,
"MemberRetailDiscount": 0,
"MemberServiceDiscount": 0,
"AllowClientsToScheduleUnpaid": true,
"OnlineBookingRestrictedToMembersOnly": [
```
{
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.membershipIds Provide
multiple
values in
new lines.
The requested
membership IDs.
```
Default: all IDs that the
```
authenticated user’s
access level allows.
query Array[integer]
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
Get the list of mobile providers that are supported by the business.
```
Response Class (Status 200)
```
OK
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 152/181
```
Try it out!
```
GET /public/v{version}/site/paymenttypes Get payment types for a site.
```
Model Example Value
```
{
```
"MobileProviders": [
```
{
```
"Id": 0,
"Active": true,
"ProviderName": "string",
"ProviderAddress": "string"
```
}
```
]
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.active When true , the
response only contains
mobile providers which are
activated. When false ,
only deactivated mobile
providers are returned.
```
Default: All Mobile
```
Providers
query boolean
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
"PaymentTypes": [
```
{
```
"Id": 0,
"PaymentTypeName": "string",
"Active": true,
"Fee": 0
```
}
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 153/181
```
Try it out!
```
GET /public/v{version}/site/programs Get service categories offered at a site.
```
Model Example Value
]
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.active When true , the
response only contains
payment types which are
activated. When false ,
only deactivated payment
types are returned.
```
Default: All Payment
```
Types
query boolean
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Programs": [
```
{
```
"Id": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 154/181
```
Try it out!
```
GET /public/v{version}/site/promocodes Get promocodes for a site.
```
Parameter Value Description ParameterType Data Type
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to
0.
query integer
request.onlineOnly If true , filters results to
show only those
programs that are shown
online.
If false , all programs
are returned.
```
Default: false
```
query boolean
request.programIds Provide
multiple
values in
new lines.
Program Ids to filter for query Array[integer]
request.scheduleType A schedule type used to
filter the returned results.
Possible values are:
All
Class
Enrollment
Appointment
Resource
Media
Arrival
query string
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
Gets a list of promocodes at the specified business. This endpoint requires staff user credentials. This staff member should
have enabled the Set up promotions / Semester discounts staff permission.
```
Response Class (Status 200)
```
OK
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 155/181
```
Model Example Value
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"PromoCodes": [
```
{
```
"PromotionID": 0,
" " " i "
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.activeOnly If true, filters results to
show only promocodes
that are active. If false,
all promocodes are
returned. Default: true
query boolean
request.endDate Filters results to
promocodes that were
activated before this
date.
query date-time
request.lastModifiedDate Filters results to
promocodes that were
modified on or after this
date.
query date-time
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to
0.
query integer
request.onlineOnly If true , filters results
to show only
promocodes that can
be used for online sale.
If false , all
promocodes are
returned. Default: false
query boolean
request.startDate Filters results to
promocodes that were
activated after this
date.
query date-time
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 156/181
```
Try it out!
```
GET /public/v{version}/site/prospectstages Gets a list of prospect stages for a site.
```
Model Example Value
Parameter Value Description ParameterType Data Type
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
Get the list of prospect stages that represent the prospect stage options for prospective clients.
```
Response Class (Status 200)
```
OK
```
{
```
"ProspectStages": [
```
{
```
"Active": true,
"Description": "string",
"Id": 0
```
}
```
]
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.active When true , the
response only contains
prospect stages which are
activated. When false ,
only deactivated prospect
stages are returned.
```
Default: All Prospect
```
Stages
query boolean
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 157/181
```
Try it out!
```
GET /public/v{version}/site/relationships Returns all active relationships of the site.
```
Model Example Value
Parameter Value Description ParameterType Data Type
```
version (required) path string
```
Implementation Notes
This endpoint retrieves the business site relationships.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Relationships": [
```
{
```
"Id": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.active When true , the response
only contains relationships
which are activated. When
false , only deactivated
relationships are returned.
```
Default: All Relationships
```
query boolean
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to 0. query integer
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 158/181
```
Try it out!
```
GET /public/v{version}/site/resourceavailabilities Get resource availabilities used at a site.
```
Model Example Value
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"ResourceAvailabilities": [
```
{
```
"ResourceId": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.endDate End date. If default,
StartDate is used.
query date-time
request.limit Number of results to
include, defaults to 100
query integer
request.locationIds Provide
multiple
values in
new lines.
Filter by location ids
```
(optional)
```
query Array[integer]
request.offset Page offset, defaults to
0.
query integer
request.programIds Provide
multiple
values in
new lines.
Filter by program ids
```
(optional)
```
query Array[integer]
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 159/181
```
Try it out!
```
GET /public/v{version}/site/resources Get resources used at a site.
```
Model Example Value
Parameter Value Description ParameterType Data Type
request.resourceIds Provide
multiple
values in
new lines.
Filter on resourceIds query Array[integer]
request.scheduleTypes
All
Class
Enrollment
Filter by schedule types
```
(optional)
```
query Array[string]
request.startDate Start time query date-time
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.includeInactive Enable to include
inactive
query boolean
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 160/181
```
Try it out!
```
GET /public/v{version}/site/sessiontypes Get the session types used at a site.
```
Model Example Value
Parameter Value Description ParameterType Data Type
request.limit Number of results to
include, defaults to 100
query integer
request.locationIds Provide
multiple
values in
new lines.
Filter by location ids
```
(optional)
```
query Array[integer]
request.offset Page offset, defaults to
0.
query integer
request.programIds Provide
multiple
values in
new lines.
Filter by program ids
```
(optional)
```
query Array[integer]
request.resourceIds Provide
multiple
values in
new lines.
Filter on resourceIds query Array[integer]
request.scheduleTypes
All
Class
Enrollment
Filter by schedule
```
types (optional)
```
query Array[string]
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 161/181
```
Try it out!
```
GET /public/v{version}/site/sites Get all sites that can be accessed by an API Key.
```
```
},
```
"SessionTypes": [
```
{
```
" " " ll"
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to
0.
query integer
request.onlineOnly When true , indicates
that only the session
types that can be
booked online should be
returned.
```
Default: false
```
query boolean
request.programIDs Provide
multiple
values in
new lines.
Filters results to session
types that belong to one
of the given program
IDs. If omitted, all
program IDs return.
query Array[integer]
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
Gets a list of sites that the developer has permission to view.
Passing in no SiteIds returns all sites that the developer has access to.
Passing in one SiteIds returns more detailed information about the specified site.
Important Behavior Notice: When calling GetSites without specifying a SiteId, or when passing multiple SiteIds, the response
will include only limited data for each site. This is expected behavior designed to help identify accessible sites without
returning full site-level configuration details. To retrieve complete information for a specific site, please make a separate
GetSites request using a single SiteId.
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 162/181
```
Model Example Value
This design helps reduce payload size for multi-site queries, but we recognize it may require additional requests when full
detail is needed. If your integration depends on full site-level data, we recommend retrieving the list of site IDs first, then
querying each one individually as needed.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"Sites": [
```
{
```
"AcceptsAmericanExpress": true,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.includeLeadChannels This is an optional
parameter to get
lead channels for a
Site.
query boolean
request.includePerStaffPricing Include whether or
not studios have per
staff pricing enabled.
query boolean
request.limit Number of results to
include, defaults to
100
query integer
request.offset Page offset, defaults
to 0.
query integer
request.siteIds Provide
multiple
values in
new lines.
List of the requested
site IDs. When
omitted, returns all
sites that the source
has access to.
query Array[integer]
version 6 version of the api. header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 163/181
```
Try it out!
```
POST /public/v{version}/site/addclientindex Add client index to a site.
```
Model Example Value
Model Example Value
Implementation Notes
Creates a new client index record at the specified business. This endpoint requires staff user credentials.
```
Response Class (Status 200)
```
OK
```
{
```
"ClientIndexID": 0,
"ClientIndexName": "string",
"Active": true,
"ShowOnNewClient": true,
"ShowOnEnrollmentRoster": true,
"EditOnEnrollmentRoster": true,
"SortOrder": 0,
"ShowInConsumerMode": true,
"RequiredConsumerMode": true,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ClientIndexName": "string",
"Active": true,
"ShowOnNewClient": true,
"ShowOnEnrollmentRoster": true,
"EditOnEnrollmentRoster": true,
"SortOrder": 0,
"ShowInConsumerMode": true,
"RequiredConsumerMode": true,
"RequiredBizMode": true
```
}
```
siteId -99 ID of the site
from which to
pull data.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 164/181
```
Try it out!
```
POST /public/v{version}/site/addpromocode Add promo code to a site.
```
Model Example Value
Model Example Value
Parameter Value Description ParameterType Data Type
```
version (required) path string
```
Implementation Notes
Creates a new promocode record at the specified business. This endpoint requires staff user credentials. This staff memeber
should have enabled the Set up promotions / Semester discounts staff permission.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PromoCode": {
```
"PromotionID": 0,
"Name": "string",
"Code": "string",
"Active": true,
```
"Discount": {
```
"Type": "string",
"Amount": 0
```
},
```
" i i " "2026 0 2 22 22 6 802 "
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"Code": "string",
"Name": "string",
"Active": true,
```
"Discount": {
```
"Type": "string",
"Amount": 0
```
},
```
"ActivationDate": "2026-01-12T22:22:46
"ExpirationDate": "2026-01-12T22:22:46
"MaxUses": 0,
"DaysAfterCloseDate": 0
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 165/181
```
Try it out!
```
POST /public/v{version}/site/deactivatepromocode Deactivate promo code to a site.
```
Model Example Value
Model Example Value
Parameter Value Description ParameterType Data Type
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
Deactivates an existing promocode record at the specified business. This endpoint requires staff user credentials. This staff
memeber should have enabled the Set up promotions / Semester discounts staff permission.
```
Response Class (Status 200)
```
OK
```
{}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"PromotionId": 0
```
}
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 166/181
```
Try it out!
```
POST /public/v{version}/site/updateclientindex Update client index.
```
Model Example Value
Model Example Value
Parameter Value Description ParameterType Data Type
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
Updates an exisitng client index record at the specified business. This endpoint requires staff user credentials.
```
Response Class (Status 200)
```
OK
```
{
```
"ClientIndexID": 0,
"ClientIndexName": "string",
"Active": true,
"ShowOnNewClient": true,
"ShowOnEnrollmentRoster": true,
"EditOnEnrollmentRoster": true,
"SortOrder": 0,
"ShowInConsumerMode": true,
"RequiredConsumerMode": true,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required) body
```
```
{
```
"ClientIndexID": 0,
"ClientIndexName": "string",
"Active": true,
"ShowOnNewClient": true,
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 167/181
```
Try it out!
Staff
```
GET /public/v{version}/staff/imageurl Get image URLs for the given staff ID in the request.
```
Model Example Value
Parameter Value Description ParameterType Data Type
Parameter content type:
application/json
"ShowOnEnrollmentRoster": true,
"EditOnEnrollmentRoster": true,
"SortOrder": 0,
"ShowInConsumerMode": true,
"RequiredConsumerMode": true,
"RequiredBizMode": true
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
Retrieves the available image URLs for a specified staff member, including desktop and mobile versions.
The resolution of these images is determined by the Mindbody product at the time the image is uploaded. Staff images are
```
automatically resized within Core (typically around 200×151 pixels), and this endpoint surfaces only the stored versions. The
```
API does not resize or limit the images itself .
For more information about how image sizes are managed in Mindbody product, refer to the related support article: link here.
```
Response Class (Status 200)
```
OK
```
{
```
"ImageURL": "string",
"MobileImageURL": "string"
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.staffId The ID of the staff
member whose image
query long
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 168/181
```
Try it out!
```
GET /public/v{version}/staff/salesreps This endpoint returns the basic details of the staffs that are marked as sales reps.
```
Model Example Value
Parameter Value Description ParameterType Data Type
URL details you want to
retrieve.
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
Implementation Notes
This endpoint returns the basic details of the staffs that are marked as sales reps.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"SalesReps": [
```
{
```
"Id": 0,
" i " " i "
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization token.
header string
request.activeOnly When true , will
return only active reps
data. Default : false
query boolean
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to
0.
query integer
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 169/181
```
Try it out!
```
GET /public/v{version}/staff/sessiontypes Get the session types used at a site for a staff member.
```
Model Example Value
Parameter Value Description ParameterType Data Type
request.salesRepNumbers Provide
multiple
values in
new lines.
This is the list of the
sales rep numbers for
which the salesrep
data will be fetched.
query Array[integer]
version 6 version of the api. header string
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
Gets a list of active session types for a specific staff member. A staff user token must be included with staff assigned the
ManageStaffPayRates permission.
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
"PageSize": 0,
"TotalResults": 0
```
},
```
"StaffSessionTypes": [
```
{
```
"StaffId": 0,
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.limit Number of results to
include, defaults to 100
query integer
request.offset Page offset, defaults to
0.
query integer
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 170/181
```
Try it out!
```
GET /public/v{version}/staff/staff Get staff members at a site.
```
Model Example Value
Parameter Value Description ParameterType Data Type
request.onlineOnly When true , indicates
that only the session
types that can be
booked online should be
returned. Default: false
query boolean
request.programIds Provide
multiple
values in
new lines.
Filters results to session
types that belong to one
of the given program
IDs. If omitted, all
program IDs return.
query Array[integer]
version 6 version of the api. header string
```
request.staffId (required) The ID of the staff
```
member whose
session types you
want to return.
query long
siteId -99 ID of the site from
which to pull data.
header string
```
version (required) path string
```
Implementation Notes
When a user token is not passed with the request or the passed user token has insufficient viewing permissions, only the
following staff data is returned in the response:
FirstName
LastName
Id
Bio
DisplayName
ImageUrl
EmpID
```
Response Class (Status 200)
```
OK
```
{
```
```
"PaginationResponse": {
```
"RequestedLimit": 0,
"RequestedOffset": 0,
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 171/181
```
"PageSize": 0,
"TotalResults": 0
```
},
```
"StaffMembers": [
```
{
```
"Address": "string"
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
request.filters Provide
multiple
values in
new lines.
Filters to apply to the search.
Possible values are:
StaffViewable
AppointmentInstructor
ClassInstructor
Male
Female
query Array[string]
request.limit Number of results to include,
defaults to 100
query integer
request.locationId Return only staff members
that are available at the
specified location. You must
supply a valid
SessionTypeID and
StartDateTime to use
this parameter.
query integer
request.offset Page offset, defaults to 0. query integer
request.sessionTypeId Return only staff members
that are available for the
specified session type. You
must supply a valid
StartDateTime and
LocationID to use this
parameter.
query integer
request.staffIds Provide
multiple
values in
new lines.
A list of the requested staff
IDs.
query Array[long]
request.startDateTime Return only staff members
that are available at the
specified date and time. You
must supply a valid
query date-time
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 172/181
```
Try it out!
```
GET /public/v{version}/staff/staffpermissions Get configured staff permissions for a staff member.
```
Model Example Value
Parameter Value Description ParameterType Data Type
SessionTypeID and
LocationID to use this
parameter.
version 6 version of the api. header string
siteId -99 ID of the site from which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
Get configured staff permissions for a staff member.
```
Response Class (Status 200)
```
OK
```
{
```
```
"UserGroup": {
```
"PermissionGroupName": "string",
"IpRestricted": true,
"AllowedPermissions": [
"ManageClassAndEventDescriptions"
],
"DeniedPermissions": [
"ManageClassAndEventDescriptions"
]
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
```
request.staffId (required) The ID of the staff
```
member whose
permissions you want to
return.
query long
siteId -99 ID of the site from which
to pull data.
header string
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 173/181
```
Try it out!
```
POST /public/v{version}/staff/addstaff
```
Creates a new staff member record at the specified business. The FirstName and LastName parameters are always required for this
request.
Model Example Value
Model Example Value
Parameter Value Description ParameterType Data Type
```
version (required) path string
```
Implementation Notes
Creates a new staff member record at the specified business. The FirstName and LastName parameters are always
required for this request.
```
Response Class (Status 200)
```
OK
```
{
```
```
"Staff": {
```
"Address": "string",
"AppointmentInstructor": true,
"AlwaysAllowDoubleBooking": true,
"Bio": "string",
"City": "string",
"Country": "string",
"Email": "string",
"FirstName": "string",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"FirstName": "string",
"LastName": "string",
"Email": "string",
"IsMale": true,
"HomePhone": "string",
"WorkPhone": "string",
"MobilePhone": "string",
"Bio": "string",
"Address": "string",
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 174/181
```
Try it out!
```
POST /public/v{version}/staff/assignsessiontype
```
Assigns a staff member to an appointment session type with staff specific properties such as time length and pay rate. A staff user token
must be included with staff assigned the ManageStaffPayRates permission.
Model Example Value
Model Example Value
Parameter Value Description ParameterType Data Type
"Address2": "string"
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
Assigns a staff member to an appointment session type with staff specific properties such as time length and pay rate. A staff
user token must be included with staff assigned the ManageStaffPayRates permission.
```
Response Class (Status 200)
```
OK
```
{
```
"StaffId": 0,
"SessionTypeId": 0,
"PayRateType": "string",
"PayRateAmount": 0,
"TimeLength": 0,
"PrepTime": 0,
"FinishTime": 0,
"Active": true
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required) body
```
```
{
```
"StaffId": 0,
"SessionTypeId": 0,
"Active": true,
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 175/181
```
Try it out!
```
POST /public/v{version}/staff/staffavailability Enables to add staff availability or unavailability for a given staff member.
```
Model Example Value
Parameter Value Description ParameterType Data Type
Parameter content type:
application/json
"TimeLength": 0,
"PrepTime": 0,
"FinishTime": 0,
"PayRateType": "string",
"PayRateAmount": 0
```
}
```
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
Enables to add staff availability or unavailability for a given staff member.
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"StaffId": 0,
"IsAvailability": true,
"Description": "string",
"ProgramIds": [
0
],
"LocationId": 0,
"DaysOfWeek": [
"string"
],
"StartTime": "string"
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
Response Messages
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 176/181
```
Try it out!
```
POST /public/v{version}/staff/updatestaff
```
Updates an existing staff member record at the specified business. The ID is a required parameters for this request.
Model Example Value
Model Example Value
HTTP Status Code Reason Response Model Headers
200 OK
Implementation Notes
Updates an existing staff member record at the specified business. The ID is a required parameters for this request.
```
Response Class (Status 200)
```
OK
```
{
```
```
"Staff": {
```
"Address": "string",
"AppointmentInstructor": true,
"AlwaysAllowDoubleBooking": true,
"Bio": "string",
"City": "string",
"Country": "string",
"Email": "string",
"FirstName": "string",
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of
the api.
header string
```
request (required)
```
Parameter content type:
application/json
body
```
{
```
"ID": 0,
"FirstName": "string",
"LastName": "string",
"Email": "string",
"IsMale": true,
"HomePhone": "string",
"WorkPhone": "string",
"MobilePhone": "string",
"Bio": "string",
"Address": "string",
"Add 2" " t i "
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 177/181
```
Try it out!
```
POST /public/v{version}/staff/updatestaffpermissions
```
Assigns a permission group to a staff member. A staff user token must be included with staff assigned the ManageStaffPayRates
permission.
Model Example Value
Model Example Value
Parameter Value Description ParameterType Data Type
siteId -99 ID of the
site from
which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
Assigns a permission group to a staff member. A staff user token must be included with staff assigned the
ManageStaffPayRates permission.
```
Response Class (Status 200)
```
OK
```
{
```
```
"UserGroup": {
```
"PermissionGroupName": "string",
"IpRestricted": true,
"AllowedPermissions": [
"ManageClassAndEventDescriptions"
],
"DeniedPermissions": [
"ManageClassAndEventDescriptions"
]
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user
authorization
token.
header string
version 6 version of the
api.
header string
```
request (required) body
```
```
{
```
"StaffId": 0,
"PermissionGroupName": "string"
```
}
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 178/181
```
Try it out!
UserToken
```
POST /public/v{version}/usertoken/issue Get a staff user token. Current lifetime: 24hrs.
```
Model Example Value
Model Example Value
Parameter Value Description ParameterType Data Type
Parameter content type:
application/json
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
Implementation Notes
When users interact with your Public API integration as staff members, they need to get a staff user token for authentication.
You can use the issue endpoint to get a staff user token, then pass the token in the headers for all of your requests.
```
Response Class (Status 200)
```
OK
```
{
```
"TokenType": "string",
"AccessToken": "string",
"Expires": "2026-01-12T22:22:46.832Z",
```
"User": {
```
"Id": 0,
"FirstName": "string",
"LastName": "string",
"Type": "string"
```
}
```
```
}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
version 6 version of the api. header string
```
request (required) body
```
```
{
```
"Username": "string",
"Password": "string"
```
}
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 179/181
```
Try it out!
```
POST /public/v{version}/usertoken/renew
```
Renews a token. Can be used to extend the lifetime of a token. Current lifetime expansion: 24hrs from current expiration, up to 7 renewals.
Model Example Value
Try it out!
Parameter Value Description ParameterType Data Type
Parameter content type:
application/json
siteId -99 ID of the site
from which to
pull data.
header string
```
version (required) path string
```
```
Response Class (Status 200)
```
OK
```
{}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 180/181
```
```
DELETE /public/v{version}/usertoken/revoke Revoke a user token.
```
Model Example Value
Try it out!
Implementation Notes
Revokes the user token in the Authorization header.
```
Response Class (Status 200)
```
OK
```
{}
```
Response Content Type application/json
Parameters
Parameter Value Description ParameterType Data Type
authorization A staff user authorization
token.
header string
version 6 version of the api. header string
siteId -99 ID of the site from which
to pull data.
header string
```
version (required) path string
```
[ BASE URL: , API VERSION: v6 ]
1/12/26, 5:24 PM MINDBODY Public API V6
```
https://api.mindbodyonline.com/public/v6/swagger/index#/ 181/181
```