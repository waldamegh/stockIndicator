# Stock Indicator
In finance, the stock indicator is commonly used in technical analysis to help smooth out the price data by creating a constantly predicted price. This project uses the following stock indicator formulas:
- Simple Moving Average (SMA)
- Exponential Moving Average (EMA)

## Simple Moving Average (SMA)
A calculation that takes the arithmetic mean of a given set of prices over a specific number of days in the past.

$SMA = {A1 + A2 + An \over n}$

where:

* $A$ = average stock price in period $n$
* $n$ = number of time periods
​

A 200-day moving average will have a much greater degree of lag than a 20-day MA because it contains prices for the past 200 days. 50-day and 200-day moving average figures are widely followed by investors and traders. SMA is most useful as a **long-term** indicator.

## Exponential Moving Average (EMA)
A type of moving average (MA) that places a greater weight on the most recent data points. EMA is most useful as a **short-term** indicator.

$EMA$ = ($Price$<sub>current</sub> $* k)+(EMA$<sub>previous</sub> $* (1 - k))$

where:
* $Price$<sub>current</sub> = current stock price
* $EMA$<sub>previous</sub>  = previous $EMA$ value 
* $k$ = $(2) \over (n + 1)$
* $n$ = number of time periods

> 📘 _The intital value of the $EMA$<sub>previous</sub> is the SMA_

---

## Moving Average Crossover Strategy
A popular trading strategy that uses one or more moving averages to identify potential buy and sell signals. The basic idea behind this strategy is to look for the crossover where one moving average crosses above or below the other.

### Moving Average Price Crossover Strategy
This strategy is to identify potential trend changes by looking for crossovers between the *price* and a *moving average (MA)* (SMA or EMA).
~~~
📉 Buy Signal = Price > MA 
📈 Sell Signal Price < MA 
~~~

### Double Moving Average Crossover Strategy
This strategy is to use two moving averages of different lengths and look for a crossover between them to signal a potential change in trend direction.
~~~
📉 Buy Signal = shorter-term MA >  longer-term MA      ➡️ golden cross
📈 Sell Signal = shorter-term MA <  longer-term MA     ➡️ death cross
~~~

### Triple Moving Average Crossover Strategy
This strategy is to use three moving averages of different lengths and look for a crossover between them to signal a potential change in trend direction.
~~~
📉 Buy Signal = (shorter-term MA >  mid-term MA) && (mid-term MA > longer-term MA) 
📈 Sell Signal = (shorter-term MA >  mid-term MA) && (mid-term MA > longer-term MA)
~~~

---