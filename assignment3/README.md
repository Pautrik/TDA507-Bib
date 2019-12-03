Author: Patrik Emanuelsson
# Assignment 3
Only part 1 was solved
## Requires
* nodejs
* npm
## Build
`npm run build`

## Run
`npm start file.txt`

## Assumptions
* No cyclical chains
* Each number in the coordinate can fit within a 64-bit floating point number
* Chain is not big enough to cause a stack over flow in the language I am using

## Approach to solving
My approach to solving this problem was to find a solution in a similar manner to Dijkstra's algorithm, but instead of finding the shortest path i wanted the longest. Also I of course disallowed multiple visits to a single point and made some edges invalid if they did not have a distance within the correct span.
