using Microsoft.AspNetCore.Mvc;
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
            return BadRequest("Something went wrong");

            return NoContent();
        }

        [HttpGet("[action]")]
        public async Task<ActionResult> ValidateUser([FromQuery]string userName)
        {
            if (userName == "aaaaaa")
            {
                return Ok(new[] { "Username already exists", "That is really stupid name" });
            }
            if (userName == "bbbbbb")
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
}
