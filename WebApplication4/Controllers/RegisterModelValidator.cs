using FluentValidation;

namespace WebApplication4.Controllers
{
    public class RegisterModelValidator : AbstractValidator<RegisterModel>
    {
        public RegisterModelValidator()
        {
            RuleFor(o => o.UserName).NotEmpty().NotNull().MinimumLength(7).Matches("aaaaaab");
        }
    }
}