package Main.dbStat;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class StatQuery {

    class PassInOut implements Serializable {
        int floor;
        int source;
        int destination;

        public PassInOut(int floor, int source, int destination) {
            this.floor = floor;
            this.source = source;
            this.destination = destination;
        }
    }

    class StatWait implements Serializable {
        int genTime;
        int inTime;

        public StatWait(int genTime, int inTime) {
            this.genTime = genTime;
            this.inTime = inTime;
        }
    }

    class ElevatorStat implements Serializable {
        String strategy;
        int passcount;

        public ElevatorStat(String strategy, int passcount) {
            this.strategy = strategy;
            this.passcount = passcount;
        }
    }

    private int totallaunches;
    private int totalpassengers;
    private int totalelevators;
    private Double avgInOutTime;
    private String mostPopularFirstName;
    private String mostPopularLastName;

    public HashMap<Integer, Integer> statMoveIn;
    public HashMap<Integer, Integer> statMoveOut;

    public HashMap<Integer, Integer> statWait;

    public HashMap<String, Integer> statElevators;

    public StatQuery() {
        statMoveIn = new HashMap<>();
        statMoveOut = new HashMap<>();
        statWait = new HashMap<>();
        statElevators = new HashMap<>();
    }

    public int getTotallaunches() {
        return totallaunches;
    }

    public int getTotalpassengers() {
        return totalpassengers;
    }

    public int getTotalelevators() {
        return totalelevators;
    }

    public Double getAvgInOutTime() {
        return avgInOutTime;
    }

    public String getMostPopularFirstName() {
        return mostPopularFirstName;
    }

    public String getMostPopularLastName() {
        return mostPopularLastName;
    }

    public List<StatWait> getStatWait() {
        List<StatWait> sw = new ArrayList<>();
        int i=1;
        for(Integer o: statWait.keySet()) {
            sw.add(new StatWait(o, statWait.get(o)));
        }
        return sw;
    }

    public List<PassInOut> getStatMove() {
        List<PassInOut> pio = new ArrayList<>();
        int i=1;
        for(Integer o: statMoveIn.keySet()) {
            if(statMoveOut.get(o)==null)
                pio.add(new PassInOut(o, statMoveIn.get(o), 0));
            else
                pio.add(new PassInOut(o, statMoveIn.get(o), statMoveOut.get(o)));
        }
        return pio;
    }

    public List<ElevatorStat> getStatElevators() {
        List<ElevatorStat> es = new ArrayList<>();
        int i=1;
        for(String s: statElevators.keySet()) {
            es.add(new ElevatorStat(s, statElevators.get(s)));
        }
        return es;
    }

    public StatQuery setTotallaunches(int totallaunches) {
        this.totallaunches = totallaunches;
        return this;
    }

    public StatQuery setTotalpassengers(int totalpassengers) {
        this.totalpassengers = totalpassengers;
        return this;
    }

    public StatQuery setTotalelevators(int totalelevators) {
        this.totalelevators = totalelevators;
        return this;
    }

    public StatQuery setAvgInOutTime(Double avgInOutTime) {
        this.avgInOutTime = avgInOutTime;
        return this;
    }

    public StatQuery setMostPopularFirstName(String mostPopularFirstName) {
        this.mostPopularFirstName = mostPopularFirstName;
        return this;
    }

    public StatQuery setMostPopularLastName(String mostPopularLastName) {
        this.mostPopularLastName = mostPopularLastName;
        return this;
    }

    public StatQuery addStatWait(int genTime, int inTime) {
        statWait.put(genTime, inTime);
        return this;
    }

    public StatQuery addStatMoveIn(int floor, int passcount) {
        statMoveIn.put(floor, passcount);
        return this;
    }

    public StatQuery addStatMoveOut(int floor, int passcount) {
        statMoveOut.put(floor, passcount);
        return this;
    }

    public StatQuery addStatElevators(String elevator, int passcount) {
        statElevators.put(elevator, passcount);
        return this;
    }

    public StatQuery setStatMoveIn(HashMap<Integer, Integer> statMoveIn) {
        this.statMoveIn = statMoveIn;
        return this;
    }

    public StatQuery setStatMoveOut(HashMap<Integer, Integer> statMoveOut) {
        this.statMoveOut = statMoveOut;
        return this;
    }

    public StatQuery setStatWait(HashMap<Integer, Integer> statWait) {
        this.statWait = statWait;
        return this;
    }

    public StatQuery setStatElevators(HashMap<String, Integer> statElevators) {
        this.statElevators = statElevators;
        return this;
    }
}
