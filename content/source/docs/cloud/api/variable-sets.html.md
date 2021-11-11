---
layout: "cloud"
page_title: "Variable Sets - API Docs - Terraform Cloud and Terraform Enterprise"
description: "Variable sets allow you to reuse variables across multiple workspaces. Create, read, update, and delete variable sets with the Terraform Cloud API."
---

# Variable Sets API

A [variable set](/docs/cloud/workspaces/variables.html#variable-sets) is a resource that allows you to reuse the same variables across multiple workspaces. For example, you could define a variable set of provider credentials and automatically apply it to one or all workspaces.

You need [`read variables` permission](/docs/cloud/users-teams-organizations/permissions.html#general-workspace-permissions) to view the variables for a particular workspace and to view the variable sets in the owning organization. You need [read and write variables permissions](/docs/cloud/users-teams-organizations/permissions.html#general-workspace-permissions) to create and edit variable sets. 


## Create a Variable Set

`POST organizations/:organization_name/varsets`

| Parameter            | Description                                                                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| `:organization_name` | The name of the organization the workspace belongs to.                                                |

### Request Body

Properties without a default value are required.

| Key path                               | Type           | Default | Description
-----------------------------------------|----------------|---------|------------
`data.name`                              | string         |         | The name of the variable set.
`data.description`                       | string         | `""`      | Text displayed in the UI to contextualize the variable set and its purpose.
`data.is_global`                         | boolean        | `false` | When true, Terraform Cloud automatically applies the variable set to all current and future workspaces in the organization.
`data.relationships.workspaces`          | array          | []      | Array of references to workspaces that the variable set should be assigned to. Sending an empty array clears all workspace assignments.
`data.relationships.vars`                | array          | []      | Array of complete variable definitions that comprise the variable set.

Terraform Cloud does not allow different global variable sets to contain conflicting variables with the same name and type. You will receive a 422 response if you try to create a global variable set that contains conflicting variables.

Status  | Response                                     | Reason(s)
--------|----------------------------------------------|----------
[200][] | [JSON API document][]                        | Successfully added variable set
[404][] | [JSON API error object][]                    | Organization not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                    | Problem with payload or request; details provided in the error object


### Sample Payload

```json
{
  "data": {
    "type": "varsets",
    "attributes": {
      "name": "MyVarset",
      "description": "Full of vars and such for mass reuse",
      "is-global": false
    },
    "relationships": {
      "workspaces": {
        "data": [
          {
            "id": "ws-z6YvbWEYoE168kpq",
            "type": "workspaces"
          }
        ]
      },
      "vars": {
        "data": [
          {
            "type": "vars",
            "attributes": {
              "key": "c2e4612d993c18e42ef30405ea7d0e9ae",
              "value": "8676328808c5bf56ac5c8c0def3b7071",
              "category": "terraform"
            }
          }
        ]
      }
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/organziations/my-organization/varsets
```

### Sample Response

```json
{
  "data": {
    "id": "varset-kjkN545LH2Sfercv"
    "type": "varsets",
    "attributes": {
      "name": "MyVarset",
      "description": "Full of vars and such for mass reuse",
      "is-global": false
    },
    "relationships": {
      "workspaces": {
        "data": [
          {
            "id": "ws-z6YvbWEYoE168kpq",
            "type": "workspaces"
          }
        ]
      },
      "vars": {
        "data": [
          {
            "id": "var-Nh0doz0hzj9hrm34qq"
            "type": "vars",
            "attributes": {
              "key": "c2e4612d993c18e42ef30405ea7d0e9ae",
              "value": "8676328808c5bf56ac5c8c0def3b7071",
              "category": "terraform"
            }
          }
        ]
      }
    }
  }
}
```

## Update a Variable Set

`PUT/PATCH varsets/:varset_id`

| Parameter            | Description         |
| -------------------- | --------------------|
| `:varset_id`         | The variable set ID |

Terraform Cloud does not allow global variable sets to contain conflicting variables with the same name and type. You will receive a 422 response if you try to create a global variable set that contains conflicting variables.

Status  | Response                                     | Reason(s)
--------|----------------------------------------------|----------
[200][] | [JSON API document][]                        | Successfully updated variable set
[404][] | [JSON API error object][]                    | Organization or variable set not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                    | Problem with payload or request; details provided in the error object


### Sample Payload

```json
{
  "data": {
    "type": "varsets",
    "attributes": {
      "name": "MyVarset",
      "description": "Full of vars and such for mass reuse. Now global!",
      "is-global": true
    },
    "relationships": {
      "vars": {
        "data": [
          {
            "type": "vars",
            "attributes": {
              "key": "c2e4612d993c18e42ef30405ea7d0e9ae",
              "value": "8676328808c5bf56ac5c8c0def3b7071",
              "category": "terraform"
            }
          }
        ]
      }
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  https://app.terraform.io/api/v2/varsets/varset-kjkN545LH2Sfercv
```

### Sample Response

```json
{
  "data": {
    "id": "varset-kjkN545LH2Sfercv"
    "type": "varsets",
    "attributes": {
      "name": "MyVarset",
      "description": "Full of vars and such for mass reuse. Now global!",
      "is-global": true
    },
    "relationships": {
      "vars": {
        "data": [
          {
            "id": "var-Nh0doz0hzj9hrm34qq"
            "type": "vars",
            "attributes": {
              "key": "c2e4612d993c18e42ef30405ea7d0e9ae",
              "value": "8676328808c5bf56ac5c8c0def3b7071",
              "category": "terraform"
            }
          }
        ]
      }
    }
  }
}
```

## Delete a Variable Set

`DELETE varsets/:varset_id`

| Parameter            | Description         |
| -------------------- | --------------------|
| `:varset_id`         | The variable set ID |

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/varsets/varset-kjkN545LH2Sfercv
```

On success, this endpoint responds with no content.

## Show Variable Set

Fetch details about the specified variable set.

`GET varsets/:varset_id`

| Parameter            | Description         |
| -------------------- | --------------------|
| `:varset_id`         | The variable set ID |

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/varsets/varset-kjkN545LH2Sfercv
```

### Sample Response

```json
{
  "data": {
    "id": "varset-kjkN545LH2Sfercv"
    "type": "varsets",
    "attributes": {
      "name": "MyVarset",
      "description": "Full of vars and such for mass reuse",
      "is-global": false
    },
    "relationships": {
      "workspaces": {
        "data": [
          {
            "id": "ws-z6YvbWEYoE168kpq",
            "type": "workspaces"
          }
        ]
      },
      "vars": {
        "data": [
          {
            "id": "var-Nh0doz0hzj9hrm34qq"
            "type": "vars",
            "attributes": {
              "key": "c2e4612d993c18e42ef30405ea7d0e9ae",
              "value": "8676328808c5bf56ac5c8c0def3b7071",
              "category": "terraform"
            }
          }
        ]
      }
    }
  }
}
```

## List Variable Set

List all variable sets for an organization.

`GET organizations/:organization_name/varsets`

| Parameter            | Description                                                                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| `:organization_name` | The name of the organization the workspace belongs to.                                                |

List all variable sets for a workspace.

`GET workspaces/:workspace_id/varsets`

| Parameter            | Description      |
| -------------------- | -----------------|
| `:workspace_id`      | The workspace ID |


### Sample Response

```json
{
  "data": [
    {
      "id": "varset-mio9UUFyFMjU33S4",
      "type": "varsets",
      "attributes":  {
         "name": "varset-b7af6a77",
         "description": "Full of vars and such for mass reuse",
         "is-global": false,
         "updated-at": "2021-10-29T17:15:56.722Z",
         "var-count":  5,
         "workspace-count": 2
      },
      "relationships": {
        "organization": {
          "data: {"id": "organization_1", "type": "organizations"}
        },
        "vars": {
          "data": [
           {"id": "var-abcd12345", "type": "vars"},
           {"id": "var-abcd12346", "type": "vars"},
           {"id": "var-abcd12347", "type": "vars"},
           {"id": "var-abcd12348", "type": "vars"},
           {"id": "var-abcd12349", "type": "vars"}
          ]
        },
        "workspaces": {
          "data": [
           {"id": "ws-abcd12345", "type": "workspaces"},
           {"id": "ws-abcd12346", "type": "workspaces"}
          ]
        }
      }
    }
  ],
  "links": {
    "self": "app.terrafor.io/app/my_organization/varsets",
    "first": "app.terrafor.io/app/my_organization/varsets?page=1",
    "prev": null,
    "next": null,
    "last": "app.terrafor.io/app/my_organization/varsets?page=1"
  }
}
```

### Variable Relationships

## Add Variable

`POST varsets/:varset_external_id/relationships/vars`

| Parameter            | Description                      |
| -------------------- | ---------------------------------|
| `:varset_id`         | The variable set ID              |

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.


Key path                                 | Type   | Default | Description
-----------------------------------------|--------|---------|------------
`data.type`                              | string |         | Must be `"vars"`.
`data.attributes.key`                    | string |         | The name of the variable.
`data.attributes.value`                  | string | `""`    | The value of the variable.
`data.attributes.description`            | string |         | The description of the variable.
`data.attributes.category`               | string |         | Whether this is a Terraform or environment variable. Valid values are `"terraform"` or `"env"`.
`data.attributes.hcl`                    | bool   | `false` | Whether to evaluate the value of the variable as a string of HCL code. Has no effect for environment variables.
`data.attributes.sensitive`              | bool   | `false` | Whether the value is sensitive. If true, variable is not visible in the UI.

Terraform Cloud does not allow different global variable sets to contain conflicting variables with the same name and type. You will receive a 422 response if you try to add a conflicting variable to a global variable set.

Status  | Response                                     | Reason(s)
--------|----------------------------------------------|----------
[200][] | [JSON API document][]                        | Successfully added variable to variable set
[404][] | [JSON API error object][]                    | Variable set not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                    | Problem with payload or request; details provided in the error object

### Sample Payload

```json
{
  "data": {
    "type": "vars",
    "attributes": {
      "key": "g6e45ae7564a17e81ef62fd1c7fa86138",
      "value": "61e400d5ccffb3782f215344481e6c82",
      "description": "cheeeese",
      "sensitive": false,
      "category": "terraform",
      "hcl": false
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/varsets/varset-4q8f7H0NHG733bBH/relationships/vars
```

### Sample Respone

```json
{
  "data": {
    "id":"var-EavQ1LztoRTQHSNT"
    "type": "vars",
    "attributes": {
      "key": "g6e45ae7564a17e81ef62fd1c7fa86138",
      "value": "61e400d5ccffb3782f215344481e6c82",
      "description": "cheeeese",
      "sensitive": false,
      "category": "terraform",
      "hcl": false
    }
  }
}
```

## Update a Variable in a Variable Set

`PATCH varsets/:varset_id/relationships/vars/:var_id`

| Parameter            | Description                      |
| -------------------- | ---------------------------------|
| `:varset_id`         | The variable set ID              |
| `:var_id`            | The ID of the variable to delete |

Terraform Cloud does not allow different global variable sets to contain conflicting variables with the same name and type. You will receive a 422 response if you try to add a conflicting variable to a global variable set.

Status  | Response                                     | Reason(s)
--------|----------------------------------------------|----------
[200][] | [JSON API document][]                        | Successfully updated variabel for variable set
[404][] | [JSON API error object][]                    | Variable set not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                    | Problem with payload or request; details provided in the error object

### Sample Payload

```json
{
  "data": {
    "type": "vars",
    "attributes": {
      "key": "g6e45ae7564a17e81ef62fd1c7fa86138",
      "value": "61e400d5ccffb3782f215344481e6c82",
      "description": "new cheeeese",
      "sensitive": false,
      "category": "terraform",
      "hcl": false
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://app.terraform.io/api/v2/varsets/varset-4q8f7H0NHG733bBH/relationships/vars/var-EavQ1LztoRTQHSNT
```

### Sample Response

```json
{
  "data": {
    "id":"var-EavQ1LztoRTQHSNT"
    "type": "vars",
    "attributes": {
      "key": "g6e45ae7564a17e81ef62fd1c7fa86138",
      "value": "61e400d5ccffb3782f215344481e6c82",
      "description": "new cheeeese",
      "sensitive": false,
      "category": "terraform",
      "hcl": false
    }
  }
}
```

## Delete a Variable in a Variable Set

`DELETEvarsets/:varset_id/relationships/vars/:var_id`

| Parameter            | Description                      |
| -------------------- | ---------------------------------|
| `:varset_id`         | The variable set ID              |
| `:var_id`            | The ID of the variable to delete |

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE\
  --data @payload.json \
  https://app.terraform.io/api/v2/varsets/varset-4q8f7H0NHG733bBH/relationships/vars/var-EavQ1LztoRTQHSNT
```

on success, responds with no content

## List Variables in a Variable Set

`GET varsets/:varset_id/relationships/vars`

| Parameter            | Description         |
| -------------------- | --------------------|
| `:varset_id`         | The variable set ID |

### Sample Response

```json
{
  "data": [
    {
      "id": "var-134r1k34nj5kjn",
      "type": "vars",
      "attributes": {
        "key": "F115037558b045dd82da40b089e5db745",
        "value": "1754288480dfd3060e2c37890422905f",
        "sensitive": false,
        "category": "terraform",
        "hcl": false,
        "created-at": "2021-10-29T18:54:29.379Z",
        "description": ""
      },
      "relationships": {
        "varset": {
          "data": {
            "id": "varset-992UMULdeDuebi1x",
            "type": "varsets"
          },
          "links": { "related": "/api/v2/varsets/1" }
        }
      },
      "links": { "self": "/api/v2/vars/var-BEPU9NjPVCiCfrXj" }
    },
  ],
  "links": {
    "self": "app.terrafor.io/app/varsets/varset-992UMULdeDuebi1x/vars",
    "first": "app.terrafor.io/app/varsets/varset-992UMULdeDuebi1x/vars?page=1",
    "prev": null,
    "next": null,
    "last": "app.terrafor.io/app/varsets/varset-992UMULdeDuebi1x/vars?page=1"
  }
}
```

### Workspaces Relationships

## Apply Variable Set to Workspaces

Accepts a list of workspaces to add the variable set to.

`POST varsets/:varset_id/relationships/workspaces`

| Parameter            | Description         |
| -------------------- | --------------------|
| `:varset_id`         | The variable set ID |

Properties without a default value are required.

| Key path                               | Type           | Default | Description
-----------------------------------------|----------------|---------|------------ 
`data[].type`                            | string         |         | Must be `"workspaces"`
`data[].id`                              | string         |         | The id of the workspace to add the variable set to

Status  | Response                     | Reason(s)
--------|------------------------------|----------
[204][] |                              | Successfully added variable set to the requested workspaces
[404][] | [JSON API error object][]    | Variable set not found or user unauthorized to perform action
[422][] | [JSON API error object][]    | Problem with payload or request; details provided in the error object

### Sample Payload

```json
{
  "data": [
    {
      "type": "workspaces",
      "id": "ws-YwfuBJZkdai4xj9w"
    }
  ]
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/varsets/varset-kjkN545LH2Sfercv/relationships/workspaces
```

## Remove a Variable Set from Workspaces

Accepts a list of workspaces to remove the variable set from.

`DELETE varsets/:varset_id/relationships/workspaces`

| Parameter            | Description         |
| -------------------- | --------------------|
| `:varset_id`         | The variable set ID |

Properties without a default value are required.

| Key path                               | Type           | Default | Description
-----------------------------------------|----------------|---------|------------ 
`data[].type`                            | string         |         | Must be `"workspaces"`
`data[].id`                              | string         |         | The id of the workspace to add the variable set to

Status  | Response                     | Reason(s)
--------|------------------------------|----------
[204][] |                              | Successfully removed variable set from the requested workspaces
[404][] | [JSON API error object][]    | Variable set not found or user unauthorized to perform action
[422][] | [JSON API error object][]    | Problem with payload or request; details provided in the error object

### Sample Payload

```json
{
  "data": [
    {
      "type": "workspaces",
      "id": "ws-YwfuBJZkdai4xj9w"
    },
    {
      "type": "workspaces",
      "id": "ws-YwfuBJZkdai4xj9w"
    }
  ]
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/varsets/varset-kjkN545LH2Sfercv/relationships/workspaces
```
