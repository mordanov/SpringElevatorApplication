package Main.dbFirstNames;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(path="/firstname/")
public class FirstNameController {

    @Autowired
    private FirstNameRepository firstNameRepository;

    @GetMapping(path="/add") // Map ONLY GET Requests
    public @ResponseBody
    String addFirstName (@RequestParam String name
    ) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request

        FirstName n = new FirstName();
        n.setFirstname(name);
        firstNameRepository.save(n);
        return "Saved";

    }

    @GetMapping(path="/delete")
    public @ResponseBody
    String delFirstName(@RequestParam int id) {
        firstNameRepository.deleteById(id);
        return "Deleted";
    }

    @GetMapping(path="/all")
    public @ResponseBody Iterable<FirstName> getAllFirstNames() {
        // This returns a JSON or XML with the users
        return firstNameRepository.findAll();
    }
}
