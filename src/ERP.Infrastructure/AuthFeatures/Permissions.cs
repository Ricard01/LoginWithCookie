using System.ComponentModel.DataAnnotations;

namespace ERP.Infrastructure.AuthFeatures;

public enum Permissions : short
{
    NotSet = 0, //error condition

    //This is an example of grouping multiple actions under one permission (using only this per group i can have multiple admins and less size in cookie)
    [Display(GroupName = "UserAdmin", Name = "All Access To Users and Roles",
        Description = "Can do anything to the User and Roles")]
    UserAllAccess = 10,

    [Display(GroupName = "UserAdmin", Name = "Create User", Description = "Can create a User")]
    UserCreate = 11,

    [Display(GroupName = "UserAdmin", Name = "Read User", Description = "Can read the User")]
    UserRead = 12,


    [Display(GroupName = "UserAdmin", Name = "All Access To Roles", Description = "Can do anything to the Roles")]
    RoleAllAccess = 20,

    [Display(GroupName = "UserAdmin", Name = "Read Roles", Description = "Can list Role")]
    RoleRead = 21,


    [Display(GroupName = "Order", Name = "All Access To Orders", Description = "Can do anything to the Order")]
    OrderAllAccess = 30,

    [Display(GroupName = "Order", Name = "Create Order", Description = "Can create the Order")]
    OrderCreate = 31,

    [Display(GroupName = "Order", Name = "Read Order", Description = "Can read the Order")]
    OrderRead = 32,

    [Display(GroupName = "Order", Name = "Edit Order", Description = "Can edit the Order")]
    OrderUpdate = 33,

    [Display(GroupName = "Order", Name = "Delete Order", Description = "Can delete the Order")]
    OrderDelete = 34,

    [Display(GroupName = "Order", Name = "Status Order", Description = "Can change the status of the Order")]
    OrderStatus = 35,


    //This is an example of what to do with permission you don't used anymore.
    //You don't want its number to be reused as it could cause problems 
    //Just mark it as obsolete and the PermissionDisplay code won't show it
    [Obsolete]
    [Display(GroupName = "Old", Name = "Not used", Description = "example of old permission")]
    OldPermissionNotUsed = 100,

    //This is an example of a permission linked to a optional (paid for?) feature
    //The code that turns roles to permissions can
    //remove this permission if the user isn't allowed to access this feature
    //[LinkedToModule(PaidForModules.Feature1)]
    //[Display(GroupName = "Features", Name = "Feature1", Description = "Can access feature1")]
    //Feature1Access = 1000,
    //[LinkedToModule(PaidForModules.Feature2)]
    //[Display(GroupName = "Features", Name = "Feature2", Description = "Can access feature2")]
    //Feature2Access = 1001,

    // [Display(GroupName = "SuperAdmin", Name = "AccessAll",
    //     Description = "This allows the user to access every feature")]
    // AccessAll = short.MaxValue
}
