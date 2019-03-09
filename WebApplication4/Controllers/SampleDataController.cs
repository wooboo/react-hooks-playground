using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace WebApplication4.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private readonly ILogger _logger;
        public SampleDataController(ILogger<SampleDataController> logger)
        {
            _logger = logger;
        }
        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet("[action]")]
        public async Task<IEnumerable<WeatherForecast>> WeatherForecasts(string area, CancellationToken cancellationToken)
        {
            var rng = new Random();

            for (int i = 0; i < 10; i++)
            {
                cancellationToken.ThrowIfCancellationRequested();
                await Task.Delay(1000);
            }
            
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Area = area,
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
            public string Area { get; set; }
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
