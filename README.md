# "Fordeling"
Task scheduling tool for local/offline use.

Caters to a very specific case of task scheduling wherein the task descriptions are subject to professional confendentiality,
and no legally acceptable form of storage is available at the time of development other than local storage on a protected
network. In place of database calls, schedule data is serialized to a locally stored .json file and loaded/modified by users
with access to the network.

Beyond this, the project is a proof of concept for collaborative use of drag-and-drop task scheduling in healtcare institutions, 
given the aforementioned set of technical and legal restrictions.

A future production version would have scheduling tasks asynchronously stored/fetched in a database, and an API integration
with roster systems.

Layout built on top of the Bootstrap framework.
