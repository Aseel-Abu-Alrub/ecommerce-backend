const roles={
    Admin:'Admin',
    User:'User'
}

export const endPoint={
getAll:[roles.Admin],
getActive:[roles.User],
create:[roles.Admin],
update:[roles.Admin],
spicific:[roles.Admin,roles.User]
}