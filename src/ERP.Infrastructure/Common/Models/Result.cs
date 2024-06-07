using ERP.Domain.Entities;

namespace ERP.Infrastructure.Common.Models;

public class Result
{
    private Result(bool succeeded, IEnumerable<string> errors)
    {
        Succeeded = succeeded;
        Errors = errors.ToArray();
    }


    public Guid? Id { get; set; }

    public bool IsUser { get; init; }

    public bool Succeeded { get; init; }

    public string[] Errors { get; init; }

    public static Result Success()
    {
        return new Result(true, Array.Empty<string>());
    }
    
 
    
    public static Result Success(Guid id, bool isUser)
    {
        return new Result(true, new string[] { }) { Id = id,  IsUser = isUser};
    }

    public static Result Failure(IEnumerable<string> errors)
    {
        return new Result(false, errors);
    }
    

}