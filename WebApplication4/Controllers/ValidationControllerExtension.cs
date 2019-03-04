using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace WebApplication4.Controllers
{
    public static class ValidationControllerExtension
    {
        private static string FirstCharToLower(this string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return input;
            }
            return $"{input.Substring(0, 1).ToLower()}{input.Substring(1)}";
        }

        private static string Camelize(this string input)
        {
            return string.Join('.', input.Split('.').Select(o => FirstCharToLower(o)));
        }
        public static ActionResult Invalid(this ControllerBase controller)
        {
            return controller.BadRequest(controller.ModelState.ToDictionary());
        }
        public static IDictionary<string, string[]> ToDictionary(this ModelStateDictionary modelState)
        {
            return modelState.Where(o => o.Value.ValidationState == ModelValidationState.Invalid)
                .ToDictionary(o => o.Key.Camelize(), o => o.Value.Errors.Select(e => e.ErrorMessage).ToArray());
        }
    }
}