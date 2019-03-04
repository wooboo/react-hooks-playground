using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication4.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet("[action]")]
        public IEnumerable<WeatherForecast> WeatherForecasts()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                DateFormatted = DateTime.Now.AddDays(index).ToString("d"),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            });
        }
        [HttpPost("[action]")]
        [ProducesResponseType(204)]
        [ValidateModelState]
        public async Task<ActionResult> Register([FromBody]RegisterModel model)
        {
            return NoContent();
        }

        [HttpGet("[action]")]
        public async Task<ActionResult> ValidateUser([FromQuery]string userName)
        {
            if (userName == "aaaaaa")
            {
                return Ok(new[] { "Username already exists", "That is really stupid name" });
            } 
            if(userName == "bbbbbb")
            {
                return Ok("No no no no");
            }

            return NoContent();
        }
        public class WeatherForecast
        {
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }
    }

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
            return string.Join('.', input.Split('.').Select(o => o.FirstCharToLower()));
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
    public class RegisterModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
    public class SomeOtherModel
    {
        public int Value { get; set; }
    }
    public class RegisterModelValidator : AbstractValidator<RegisterModel>
    {
        public RegisterModelValidator()
        {
            RuleFor(o => o.UserName).NotEmpty().NotNull().MinimumLength(7).Matches("aaaaaab");
        }
    }
    public class SomeOtherModelValidator : AbstractValidator<SomeOtherModel>
    {
        public SomeOtherModelValidator()
        {
            RuleFor(o => o.Value).GreaterThan(10);
        }
    }
}
