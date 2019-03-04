using FluentValidation;

namespace WebApplication4.Controllers
{
    public class SomeOtherModelValidator : AbstractValidator<SomeOtherModel>
    {
        public SomeOtherModelValidator()
        {
            RuleFor(o => o.Value).GreaterThan(10);
        }
    }
}