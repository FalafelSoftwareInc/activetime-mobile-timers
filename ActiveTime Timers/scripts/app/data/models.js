define([], function () {
	"use strict";

	return {
		recentProjects: {
			type: "xml",
			data: "/tasks/task",
			model: {
				fields: {
					id: { field: "id/text()", type: "number" },
					name: { field: "name/text()", type: "string" },
					position: { field: "position/text()", type: "number" },
					projectId: { field: "project_id/text()", type: "number" },
					openedOn: { field: "opened_on/text()", type: "date" },
					closedOn: { field: "closed_on/text()", type: "date" },
					budget: { field: "budget/text()", type: "number" },
					billable: { field: "billable/text()", type: "boolean" }
				}
			}
		},

		clients: {
			type: "xml",
			data: "/clients/client",
			model: {
				fields: {
					id: { field: "id/text()", type: "number" },
					name: { field: "name/text()", type: "string" }
				}
			}
		},

		projects: {
			type: "xml",
			data: "/projects/project",
			model: {
				fields: {
					id: { field: "id/text()", type: "number" },
					name: { field: "name/text()", type: "string" },
					budget: { field: "budget/text()", type: "number" },
					clientId: { field: "client_id/text()", type: "number" },
					ownerId: { field: "owner_id/text()", type: "number" },
					openedOn: { field: "opened_on/text()", type: "date" },
					closedOn: { field: "closed_on/text()", type: "date" },
					createdAt: { field: "created_at/text()", type: "date" },
					updatedAt: { field: "updated_at/text()", type: "date" },
					clientName: { field: "client_name/text()", type: "string" },
					sumHours: { field: "sum_hours/text()", type: "number" },
					userCount: { field: "user_count/text()", type: "number" }
				}
			}
		},

		tasks: {
			type: "xml",
			data: "/clients/client/projects/project/tasks/task",
			model: {
				fields: {
					id: { field: "id/text()", type: "number" },
					name: { field: "name/text()", type: "string" },
					position: { field: "position/text()", type: "number" },
					projectId: { field: "project_id/text()", type: "number" },
					openedOn: { field: "opened_on/text()", type: "date" },
					closedOn: { field: "closed_on/text()", type: "date" },
					budget: { field: "budget/text()", type: "number" },
					billable: { field: "billable/text()", type: "boolean" }
				}
			}
		},

        todaysEntries: function () {
            return {
                type: "xml",
                data: "/entries/entry",
                model: {
                    fields: {
    					id: { field: "id/text()", type: "number" },
                        taskId: { field: "task_id/text()", type: "number" },
                        userId: { field: "user_id/text()", type: "number" },
                        date: { field: "date/text()", type: "date" },
                        hours: { field: "hours/text()", type: "number" },
                        notes: { field: "notes/text()", type: "string" },
                        billable: { field: "billable/text()", type: "boolean" },
                        billed: { field: "billed/text()", type: "boolean" },
                        createdAt: { field: "created_at/text()", type: "date" },
                        updatedAt: { field: "updated_at/text()", type: "date" },
                        userEmail: { field: "user_email/text()", type: "string" },
                        taskName: { field: "task_name/text()", type: "string" },
                        sumHours: { field: "sum_hours/text()", type: "number" },
                        budgetType: { field: "budget_type/text()", type: "number" },
                        projectName: { field: "project_name/text()", type: "string" },
                        clientName: { field: "client_name/text()", type: "string" }
                    }
                }
            };
        }
	};
});