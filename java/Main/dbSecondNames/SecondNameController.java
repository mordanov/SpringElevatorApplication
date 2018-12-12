package Main.dbSecondNames;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path="/secondname/")
public class SecondNameController {

    @Autowired
    private SecondNameRepository secondNameRepository;

    @GetMapping(path="/add") // Map ONLY GET Requests
    public @ResponseBody
    String addSecondName (@RequestParam String name
    ) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request

        SecondName n = new SecondName();
        n.setSecondname(name);
        secondNameRepository.save(n);
        return "Saved";
    }

    @GetMapping(path="/delete")
    public @ResponseBody
    String delSecondName(@RequestParam int id) {
        secondNameRepository.deleteById(id);
        return "Deleted";
    }

    @GetMapping(path="/all")
    public @ResponseBody Iterable<SecondName> getAllSecondNames() {
        // This returns a JSON or XML with the users
        return secondNameRepository.findAll();
    }

}
