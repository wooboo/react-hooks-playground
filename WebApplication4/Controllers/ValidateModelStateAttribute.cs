using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Formatters;

namespace WebApplication4.Controllers
{
    public class ValidateModelStateAttribute : ActionFilterAttribute, IApiResponseMetadataProvider
    {
        public Type Type => typeof(IDictionary<string, string[]>);

        public int StatusCode => 400;

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                context.Result = new BadRequestObjectResult(context.ModelState.ToDictionary());
            }
        }

        public void SetContentTypes(MediaTypeCollection contentTypes)
        {
            throw new NotImplementedException();
        }
    }
}