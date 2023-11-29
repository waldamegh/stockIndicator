# Stock Indicator
In finance, the stock indicator is commonly used in technical analysis to help smooth out the price data by creating a constantly predicted price. This project uses the following stock indicator formulas:
- Simple Moving Average (SMA)
- Exponential Moving Average (EMA)

## Simple Moving Avrage (SMA)
A calculation that takes the arithmetic mean of a given set of prices over a specific number of days in the past.

$SMA = {A1 + A2 + An \over n}$

where:

* $A$ = average in period $n$
* $n$ = number of time periods
​

A 200-day moving average will have a much greater degree of lag than a 20-day MA because it contains prices for the past 200 days. 50-day and 200-day moving average figures are widely followed by investors and traders.

A rising moving average indicates that the security is in an uptrend, while a declining moving average indicates that it is in a downtrend.

## Exponential Moving Average (EMA)