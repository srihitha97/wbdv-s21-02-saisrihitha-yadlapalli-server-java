var $usernameFld, $passwordFld
var $firstNameFld, $lastNameFld, $roleFld
var $createBtn, $updateBtn
var $userRowTemplate, $tbody

var adminUserService = new AdminUserServiceClient()

function createUser() {
    var newUser = {
        username: $usernameFld.val(),
        password: $passwordFld.val(),
        firstName: $firstNameFld.val(),
        lastName: $lastNameFld.val(),
        role: $roleFld.val()
    }

    adminUserService.createUser(newUser)
        .then(function (actualUser) {
            users.push(actualUser)
            renderUsers(users)
        })
    $usernameFld.val("")
    $passwordFld.val("")
    $firstNameFld.val("")
    $lastNameFld.val("")
    $roleFld.val("")
}

function renderUsers(users) {
    $tbody.empty()
    for (var i = 0; i < users.length; i++) {
        var user = users[i]
        $tbody
            .append(`
      <tr class="wbdv-template table-warning wbdv-user wbdv-hidden">
          <td class="text-danger">${user.username}</td>
          <td class="text-danger">${"*******"}</td>
          <td class="text-danger">${user.firstName}</td>
          <td class="text-danger">${user.lastName}</td>
          <td class="text-danger">${user.role}</td>
          <td>
              <i id="${i}" class="fa-2x fa fa-times wbdv-remove text-dark"></i>
              <i id="${user._id}" class="fa-2x fa fa-pencil wbdv-edit text-dark"></i>
          </td>
      </tr>
      `)
    }

    $(".wbdv-remove").click(deleteUser)
    $(".wbdv-edit").click(selectUser)
}

function deleteUser(event) {
    var button = $(event.target)
    var index = button.attr("id")
    var id = users[index]._id
    adminUserService.deleteUser(id)
        .then(function (status) {
            users.splice(index, 1)
            renderUsers(users)
        })
}

var selectedUser = null

function selectUser(event) {
    var id = $(event.target).attr("id")
    console.log(id)
    selectedUser = users.find(user => user._id === id)
    $usernameFld.val(selectedUser.username)
    $passwordFld.val(selectedUser.password)
    $firstNameFld.val(selectedUser.firstName)
    $lastNameFld.val(selectedUser.lastName)
    $roleFld.val(selectedUser.role)
}

function updateUser() {
    selectedUser.username = $usernameFld.val()
    selectedUser.password = $passwordFld.val()
    selectedUser.firstName = $firstNameFld.val()
    selectedUser.lastName = $lastNameFld.val()
    selectedUser.role = $roleFld.val()
    adminUserService.updateUser(selectedUser._id, selectedUser).then(status => {
        var index = users.findIndex(user => user._id === selectedUser._id)
        users[index] = selectedUser
        renderUsers(users)
    })
    $usernameFld.val("")
    $passwordFld.val("")
    $firstNameFld.val("")
    $lastNameFld.val("")
    $roleFld.val("")
}

function main() {
    $createBtn = jQuery("#createBtnId")
    $updateBtn = jQuery(".wbdv-update")

    $userRowTemplate = $(".wbdv-tbody")
    $tbody = $(".wbdv-tbody")
    $usernameFld = $("#usernameFld")
    $passwordFld = $("#passwordFld")
    $firstNameFld = $("#firstNameFld")
    $lastNameFld = $("#lastNameFld")
    $roleFld = $("#roleFld")

    $createBtn.click(createUser)
    $updateBtn.click(updateUser)

    adminUserService.findAllUsers().then(function (actualUsers) {
        users = actualUsers
        console.log(users)
        renderUsers(users)
    })
}

$(main)