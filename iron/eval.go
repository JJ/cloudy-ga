package main

import (
	"encoding/json"
	"fmt"
	"os"
)

type Individual struct {
	Chromosome string
}

func main() {
	p := &Individual{Chromosome: ""}
	json.NewDecoder(os.Stdin).Decode(p)
	count_ones := 0
	for i := 0; i < len(p.Chromosome); i++ {
		if p.Chromosome[i] == '1' {
			count_ones++;
		}
	}
	fmt.Printf("{ eval: %d }", count_ones)
}
