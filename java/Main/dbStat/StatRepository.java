package Main.dbStat;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;

@Controller
@RequestMapping(path="/stats/")
public class StatRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @GetMapping(path="/launchstat")
    public @ResponseBody
    String getTotalReport(@RequestParam String GDate1,
                              @RequestParam String GTimeH1,
                              @RequestParam String GTimeM1,
                              @RequestParam String GDate2,
                              @RequestParam String GTimeH2,
                              @RequestParam String GTimeM2
    ) {
        String param1 = GDate1 + " " + GTimeH1 + ":" + GTimeM1;
        String param2 = GDate2 + " " + GTimeH2 + ":" + GTimeM2;
        StatQuery sq = new StatQuery();
        sq
            .setTotallaunches(this.jdbcTemplate.queryForObject("SELECT COUNT(*) FROM ( SELECT DISTINCT launchid FROM stat ) ss", Integer.class))
            .setTotalpassengers(this.jdbcTemplate.queryForObject("SELECT COUNT(*) FROM stat", Integer.class))
            .setTotalelevators(this.jdbcTemplate.queryForObject("SELECT SUM(elevcount) FROM launches", Integer.class))
            .setAvgInOutTime(this.jdbcTemplate.queryForObject("SELECT AVG(outTime - inTime) FROM stat", Double.class))
            .setMostPopularFirstName(this.jdbcTemplate.queryForObject("SELECT t.firstname FROM (SELECT firstname, count(*) FROM stat GROUP BY firstname ORDER BY 2 DESC LIMIT 1) t", String.class))
            .setMostPopularLastName(this.jdbcTemplate.queryForObject("SELECT t.lastname FROM (SELECT lastname, count(*) FROM stat GROUP BY lastname ORDER BY 2 DESC LIMIT 1) t", String.class));

        String sql = "SELECT COUNT(s.id), s.source FROM stat s\n" +
                "  INNER JOIN launches l ON s.launchid = l.id\n" +
                "  WHERE l.lstart BETWEEN ? AND ? GROUP BY s.source";
        sq.setStatMoveIn(this.jdbcTemplate.query(
                sql,
                new Object[] {param1, param2},
                resultSet -> {
                    while(resultSet.next()) {
                        sq.addStatMoveIn(resultSet.getInt(2), resultSet.getInt(1));
                    }
                    return sq.statMoveIn;
                }
        ));

        sql = "SELECT COUNT(s.id), s.destination FROM stat s\n" +
                "  INNER JOIN launches l ON s.launchid = l.id\n" +
                "  WHERE l.lstart BETWEEN ? AND ? GROUP BY s.destination";
        sq.setStatMoveOut(this.jdbcTemplate.query(
                sql,
                new Object[] {param1, param2},
                resultSet -> {
                    while(resultSet.next()) {
                        sq.addStatMoveOut(resultSet.getInt(2), resultSet.getInt(1));
                    }
                    return sq.statMoveOut;
                }
        ));

        sql = "SELECT ROUND(s.generateTime), ROUND(AVG(s.inTime) - s.generateTime)\n" +
                "  FROM stat s\n" +
                "  INNER JOIN launches l ON s.launchid = l.id\n" +
                "  WHERE l.lstart BETWEEN ? AND ? \n" +
                "GROUP BY ROUND(generateTime)\n" +
                "ORDER BY generateTime";
        sq.setStatWait(this.jdbcTemplate.query(
                sql,
                new Object[] {param1, param2},
                resultSet -> {
                    while(resultSet.next()) {
                        sq.addStatWait(resultSet.getInt(1), resultSet.getInt(2));
                    }
                    return sq.statWait;
                }
        ));

        sql = "SELECT s.elevStrategy, COUNT(s.id) FROM stat s\n" +
                "  INNER JOIN launches l ON s.launchid = l.id\n" +
                "  WHERE l.lstart BETWEEN ? AND ? \n" +
                "  GROUP BY s.elevStrategy";
        sq.setStatElevators(this.jdbcTemplate.query(
                sql,
                new Object[] {param1, param2},
                resultSet -> {
                    while(resultSet.next()) {
                        sq.addStatElevators(resultSet.getString(1), resultSet.getInt(2));
                    }
                    return sq.statElevators;
                }
        ));

        Gson gson = new GsonBuilder()
                .disableHtmlEscaping()
                .enableComplexMapKeySerialization()
                .setPrettyPrinting()
                .create();

        JsonObject myObj = new JsonObject();
        myObj.addProperty("totallaunches", sq.getTotallaunches());
        myObj.addProperty("totalpassengers", sq.getTotalpassengers());
        myObj.addProperty("totalelevators", sq.getTotalelevators());
        myObj.addProperty("avgInOutTime", sq.getAvgInOutTime());
        myObj.addProperty("mostPopularFirstName", sq.getMostPopularFirstName());
        myObj.addProperty("mostPopularLastName", sq.getMostPopularLastName());
        myObj.add("statMove", gson.toJsonTree(sq.getStatMove()));
        myObj.add("statWait", gson.toJsonTree(sq.getStatWait()));
        myObj.add("statElevators", gson.toJsonTree(sq.getStatElevators()));

        return myObj.toString();
    }

}
