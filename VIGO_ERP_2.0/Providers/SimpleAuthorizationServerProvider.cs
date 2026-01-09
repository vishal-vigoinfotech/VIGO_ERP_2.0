using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Security;
using VIGO_ERP_2._0.Utilities;

namespace VIGO_ERP_2._0.Providers
{
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var allowedOrigin = context.OwinContext.Get<string>("as:clientAllowedOrigin");
            if (allowedOrigin == null) allowedOrigin = "*";
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { allowedOrigin });
            //Validate user with membership database
            if (context.UserName.Contains('#')) { return MobileLogin(context); }
            else { return WebSiteLogin(context); }
        }

        public static Task MobileLogin(OAuthGrantResourceOwnerCredentialsContext context)
        {
            string[] contextdetails = context.UserName.Split(new string[] { "#" }, StringSplitOptions.RemoveEmptyEntries);
            var userInfo = Membership.GetUser(contextdetails[0].ToUpper());

            if (userInfo != null)
            {
             

                // Check Device Validation
                var chkreslt = Utility.CheckUserDeviceMap(userInfo.ProviderUserKey.ToString(), contextdetails[1]);

                if (chkreslt == "Done")
                //if(true)
                {
                    bool user = Membership.ValidateUser(contextdetails[0], context.Password); //code
                    if (!userInfo.IsApproved)
                    {
                        context.SetError("invalid_grant", "Inactive User.Contact Administrator.");
                        //context.Response.StatusCode = 401;
                        HttpContext.Current.Response.Headers.Add("invalid_grant", "Inactive User.Contact Administrator.");
                        return Task.FromResult<object>(context.OwinContext.Response);
                    }
                    else if (userInfo.IsLockedOut == true)
                    {
                        context.SetError("invalid_grant", "Inactive User.Contact Administrator.");
                        //context.Response.StatusCode = 401;
                        HttpContext.Current.Response.Headers.Add("invalid_grant", "Inactive User.Contact Administrator.");
                        return Task.FromResult<object>(context.OwinContext.Response);
                    }
                    else if (!user)
                    {
                        context.SetError("invalid_grant", "The user name or password is incorrect.");
                        //context.Response.StatusCode = 401;
                        HttpContext.Current.Response.Headers.Add("invalid_grant", "The user name or password is incorrect.");
                        return Task.FromResult<object>(context.OwinContext.Response);
                        //return Task.FromResult<object>(context.OwinContext.Response.StatusCode);
                    }
                    else if (!user)
                    {
                        context.SetError("invalid_grant", "The user name or password is incorrect.");
                        //context.Response.StatusCode = 401;
                        HttpContext.Current.Response.Headers.Add("invalid_grant", "The user name or password is incorrect.");
                        return Task.FromResult<object>(context.OwinContext.Response);
                        //return Task.FromResult<object>(context.OwinContext.Response.StatusCode);
                    }
                    else
                    {
                        var userRole = string.Empty; ;
                        string[] roles = Roles.GetRolesForUser(contextdetails[0].ToUpper());
                        if (roles != null && roles.Count() > 0) { userRole = roles[0].Trim().ToUpper(); }

                        //Claims Defining
                        var userDetails = Utility.GetUserDetails(new Guid(userInfo.ProviderUserKey.ToString()));
                        ClaimsIdentity identity = new ClaimsIdentity(context.Options.AuthenticationType);
                        try
                        {
                            //Pass user-id in the ClaimTypes.Name          
                            identity.AddClaim(new Claim("UserId", userInfo.ProviderUserKey.ToString()));
                            identity.AddClaim(new Claim("UserRole", userRole));
                            identity.AddClaim(new Claim("UserName", userInfo.UserName));
                            if (userDetails != null)
                            {
                                identity.AddClaim(new Claim("CompId", userDetails.CompId.ToString()));
                                identity.AddClaim(new Claim("BranchId", userDetails.BranchId.ToString()));
                                identity.AddClaim(new Claim("DepartmentId", userDetails.DepartmentId.ToString()));
                            }

                            identity.AddClaim(new Claim("Email", userInfo.Email));
                            //identity.AddClaim(new Claim("Access", userDetails.Access));  //comment
                            //HttpContext.Current.Session.Add("Access", userInfo..Access);
                            //identity.AddClaim(new Claim("Scheme", ""));
                        }
                        catch (Exception ex)
                        {

                        }

                        var props = new AuthenticationProperties(new Dictionary<string, string> { { "as:client_id", context.ClientId ?? string.Empty } });
                        var ticket = new AuthenticationTicket(identity, props);

                        var cookieIdentity = new ClaimsIdentity(identity.Claims, DefaultAuthenticationTypes.ApplicationCookie);

                        HttpContext.Current.GetOwinContext().Authentication.SignIn(
                            new AuthenticationProperties { IsPersistent = true },
                            cookieIdentity
                        );


                        context.Validated(ticket);
                    }
                }
                else
                {
                    context.SetError("invalid_grant", chkreslt);
                    //context.Response.StatusCode = 401;
                    HttpContext.Current.Response.Headers.Add("invalid_grant", chkreslt);
                    return Task.FromResult<object>(context.OwinContext.Response);
                }
            }
            else
            {
                context.SetError("invalid_grant", "The user name or company code is incorrect.");
                //context.Response.StatusCode = 401;
                HttpContext.Current.Response.Headers.Add("invalid_grant", "The user name or company code is incorrect.");
                return Task.FromResult<object>(context.OwinContext.Response);
                //return Task.FromResult<object>(context.OwinContext.Response.StatusCode);
            }

            return Task.FromResult<object>(null);
        }

        public static Task WebSiteLogin(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var userInfo = Membership.GetUser(context.UserName.Trim().ToUpper());

            if (userInfo == null)
            {
                context.SetError("invalid_grant", "The user name or company code is incorrect.");
                HttpContext.Current.Response.Headers.Add("invalid_grant", "The user name or company code is incorrect.");
                return Task.FromResult<object>(null);
            }

            bool userValid = Membership.ValidateUser(context.UserName.Trim(), context.Password);

            if (!userInfo.IsApproved)
            {
                context.SetError("invalid_grant", "Inactive User. Contact Administrator.");
                return Task.FromResult<object>(null);
            }

            if (userInfo.IsLockedOut)
            {
                context.SetError("invalid_grant", "User is locked. Contact Administrator.");
                return Task.FromResult<object>(null);
            }

            if (!userValid)
            {
                context.SetError("invalid_grant", "The user name or password is incorrect.");
                return Task.FromResult<object>(null);
            }

            // 🔹 Get Role
            string userRole = string.Empty;
            var roles = Roles.GetRolesForUser(context.UserName.Trim().ToUpper());
            if (roles != null && roles.Length > 0)
                userRole = roles[0].Trim().ToUpper();

            // 🔹 Get Extra User Details
            var userDetails = Utility.GetUserDetails(new Guid(userInfo.ProviderUserKey.ToString()));

            // 🔹 OAuth Identity (Token)
            ClaimsIdentity oauthIdentity = new ClaimsIdentity(context.Options.AuthenticationType);

            oauthIdentity.AddClaim(new Claim("UserId", userInfo.ProviderUserKey.ToString()));
            oauthIdentity.AddClaim(new Claim("UserName", userInfo.UserName));
            oauthIdentity.AddClaim(new Claim("UserRole", userRole));
            oauthIdentity.AddClaim(new Claim("Email", userInfo.Email));

            if (userDetails != null)
            {
                oauthIdentity.AddClaim(new Claim("CompId", userDetails.CompId.ToString()));
                oauthIdentity.AddClaim(new Claim("BranchId", userDetails.BranchId.ToString()));
                oauthIdentity.AddClaim(new Claim("DepartmentId", userDetails.DepartmentId.ToString()));
            }


            ClaimsIdentity cookieIdentity = new ClaimsIdentity(
                oauthIdentity.Claims,
                DefaultAuthenticationTypes.ApplicationCookie
            );

    
            HttpContext.Current.GetOwinContext().Authentication.SignIn(
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    AllowRefresh = true
                },
                cookieIdentity
            );

           
            var props = new AuthenticationProperties(new Dictionary<string, string>
                {
                    { "as:client_id", context.ClientId ?? string.Empty }
                });

            var ticket = new AuthenticationTicket(oauthIdentity, props);
            context.Validated(ticket);

            return Task.FromResult<object>(null);
        }



    }
}